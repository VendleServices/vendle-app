import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface RoomUser {
    id: string;
    email: string;
    companyName?: string;
    userType?: string;
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    roomId: string;
    userId: string;
    sender: {
        id: string;
        email: string;
        companyName?: string;
    };
}

export interface Room {
    id: string;
    otherUser: RoomUser;
    lastMessage: Message | null;
    unreadCount: number;
    updatedAt: string;
}

// Hook to get all rooms for current user
export function useRooms() {
    const apiService = useApiService();
    const { user } = useAuth();

    return useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const response: any = await apiService.get('/api/rooms');
            return {
                rooms: (response?.rooms || []) as Room[],
                totalUnread: response?.totalUnread || 0
            };
        },
        enabled: !!user?.id,
        refetchInterval: 30000, // Refetch every 30 seconds for unread updates
    });
}

// Hook to get unread message count
export function useUnreadCount() {
    const apiService = useApiService();
    const { user } = useAuth();

    return useQuery({
        queryKey: ['unreadCount'],
        queryFn: async () => {
            const response: any = await apiService.get('/api/rooms/unread-count');
            return response?.totalUnread || 0;
        },
        enabled: !!user?.id,
        refetchInterval: 30000,
    });
}

// Hook to get messages for a specific room
export function useRoomMessages(roomId: string | null) {
    const apiService = useApiService();
    const { user } = useAuth();

    return useQuery({
        queryKey: ['roomMessages', roomId],
        queryFn: async () => {
            if (!roomId) return [];
            const response: any = await apiService.get(`/api/rooms/${roomId}/messages`);
            return response as Message[];
        },
        enabled: !!user?.id && !!roomId,
    });
}

// Hook to initiate or get existing room with another user
export function useInitiateRoom() {
    const apiService = useApiService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (otherUserId: string) => {
            const response: any = await apiService.post('/api/rooms/initiate', { otherUserId });
            return {
                room: response.room,
                otherUser: response.otherUser,
                isNew: response.isNew
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
        onError: (error: any) => {
            console.error('Error initiating room:', error);
        },
    });
}

// Hook to send a message
export function useSendMessage() {
    const apiService = useApiService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, roomId }: { content: string; roomId: string }) => {
            const response: any = await apiService.post('/api/messages', { content, roomId });
            return response.newMessage as Message;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['roomMessages', variables.roomId] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
        onError: (error: any) => {
            console.error('Error sending message:', error);
        },
    });
}

// Hook to mark room as read
export function useMarkAsRead() {
    const apiService = useApiService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roomId: string) => {
            await apiService.post(`/api/rooms/${roomId}/read`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });
}