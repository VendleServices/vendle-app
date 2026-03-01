'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { pusherClient } from '@/lib/pusher';
import { useAuth } from '@/contexts/AuthContext';
import {
    useRooms,
    useRoomMessages,
    useInitiateRoom,
    useSendMessage,
    useMarkAsRead,
    Room,
    Message,
} from '@/hooks/useMessaging';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    MessageSquare,
    X,
    Send,
    ArrowLeft,
    User,
    Clock,
} from 'lucide-react';

interface MessagingDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // Optional: directly open a chat with a specific user
    initialUserId?: string | null;
    initialUserName?: string | null;
}

export default function MessagingDrawer({
    isOpen,
    onClose,
    initialUserId = null,
    initialUserName = null,
}: MessagingDrawerProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // State
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isInitiating, setIsInitiating] = useState(false);

    // Refs
    const scrollRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasInitiatedRef = useRef(false);

    // Hooks
    const { data: roomsData, isLoading: roomsLoading } = useRooms();
    const { data: roomMessages, isLoading: messagesLoading } = useRoomMessages(selectedRoom?.id || null);
    const initiateRoomMutation = useInitiateRoom();
    const sendMessageMutation = useSendMessage();
    const markAsReadMutation = useMarkAsRead();

    const rooms = roomsData?.rooms || [];

    // Handle initial user ID - start chat with specific user
    useEffect(() => {
        if (isOpen && initialUserId && !selectedRoom && !hasInitiatedRef.current && !isInitiating) {
            hasInitiatedRef.current = true;
            setIsInitiating(true);
            initiateRoomMutation.mutate(initialUserId, {
                onSuccess: (data) => {
                    setSelectedRoom({
                        id: data.room.id,
                        otherUser: data.otherUser,
                        lastMessage: null,
                        unreadCount: 0,
                        updatedAt: new Date().toISOString(),
                    });
                    setIsInitiating(false);
                },
                onError: () => {
                    setIsInitiating(false);
                    hasInitiatedRef.current = false; // Allow retry on error
                },
            });
        }
    }, [isOpen, initialUserId, selectedRoom, isInitiating]);

    // Reset the ref when drawer closes
    useEffect(() => {
        if (!isOpen) {
            hasInitiatedRef.current = false;
        }
    }, [isOpen]);

    // Set messages when room messages are fetched
    useEffect(() => {
        if (roomMessages) {
            setMessages(roomMessages);
        }
    }, [roomMessages]);

    // Debounced mark as read
    const markAsRead = useCallback(() => {
        if (!selectedRoom?.id || !user?.id) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            markAsReadMutation.mutate(selectedRoom.id);
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRoom?.id, user?.id]);

    // Mark as read when opening a room
    useEffect(() => {
        if (selectedRoom && messages.length > 0) {
            markAsRead();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRoom?.id, messages.length]);

    // Pusher subscription for real-time messages
    useEffect(() => {
        if (!selectedRoom?.id) return;

        const channel = pusherClient.subscribe(`private-room-${selectedRoom.id}`);

        channel.bind('new-message', (data: Message) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === data.id)) return prev;
                return [...prev, data];
            });
            // Mark as read when new message arrives
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(() => {
                markAsReadMutation.mutate(selectedRoom.id);
            }, 500);
        });

        return () => {
            pusherClient.unsubscribe(`private-room-${selectedRoom.id}`);
            channel.unbind_all();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRoom?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    // Reset state when drawer closes
    useEffect(() => {
        if (!isOpen) {
            // Only reset if not using initialUserId
            if (!initialUserId) {
                setSelectedRoom(null);
            }
            setMessages([]);
            setNewMessage('');
        }
    }, [isOpen, initialUserId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedRoom?.id) return;

        const contentToSend = newMessage;
        setNewMessage('');

        sendMessageMutation.mutate(
            { content: contentToSend, roomId: selectedRoom.id },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['rooms'] });
                },
            }
        );
    };

    const handleSelectRoom = (room: Room) => {
        setSelectedRoom(room);
        setMessages([]);
    };

    const handleBack = () => {
        setSelectedRoom(null);
        setMessages([]);
        // Refresh rooms list to update unread counts
        queryClient.invalidateQueries({ queryKey: ['rooms'] });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const getDisplayName = (otherUser: Room['otherUser']) => {
        return otherUser?.companyName || otherUser?.email || 'Unknown User';
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-4 py-4 border-b bg-white">
                    <div className="flex items-center gap-3">
                        {selectedRoom && !initialUserId && (
                            <button
                                onClick={handleBack}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                        )}
                        <MessageSquare className="h-5 w-5 text-vendle-blue" />
                        <SheetTitle className="text-lg font-semibold">
                            {selectedRoom
                                ? getDisplayName(selectedRoom.otherUser)
                                : initialUserName || 'Messages'}
                        </SheetTitle>
                    </div>
                </SheetHeader>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {isInitiating ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendle-blue mx-auto mb-3"></div>
                                <p className="text-sm text-gray-500">Starting conversation...</p>
                            </div>
                        </div>
                    ) : selectedRoom ? (
                        // Chat View
                        <>
                            <ScrollArea className="flex-1 px-4">
                                <div className="py-4 space-y-3">
                                    {messagesLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vendle-blue"></div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500">No messages yet</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Send a message to start the conversation
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${
                                                    msg.userId === user?.id ? 'items-end' : 'items-start'
                                                }`}
                                            >
                                                <span className="text-[10px] text-gray-400 mb-1 px-1">
                                                    {msg.sender?.email || 'Unknown'}
                                                </span>
                                                <div
                                                    className={`px-4 py-2 rounded-2xl max-w-[85%] break-words ${
                                                        msg.userId === user?.id
                                                            ? 'bg-vendle-blue text-white rounded-br-none'
                                                            : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                                                    }`}
                                                >
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-4 border-t bg-gray-50 flex gap-2"
                            >
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-full"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                                    className="bg-vendle-blue hover:bg-vendle-blue/90 rounded-full px-4"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </>
                    ) : (
                        // Rooms List View
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-2">
                                {roomsLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendle-blue"></div>
                                    </div>
                                ) : rooms.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No Conversations
                                        </h3>
                                        <p className="text-sm text-gray-500 max-w-xs">
                                            Start a conversation by messaging a contractor or homeowner
                                            from their project page.
                                        </p>
                                    </div>
                                ) : (
                                    rooms.map((room) => (
                                        <button
                                            key={room.id}
                                            onClick={() => handleSelectRoom(room)}
                                            className="w-full p-4 rounded-lg border border-gray-200 hover:border-vendle-blue/30 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-5 w-5 text-vendle-blue" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {getDisplayName(room.otherUser)}
                                                        </p>
                                                        {room.lastMessage && (
                                                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                                {formatTime(room.lastMessage.createdAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {room.lastMessage?.content || 'No messages yet'}
                                                        </p>
                                                        {room.unreadCount > 0 && (
                                                            <Badge className="bg-vendle-blue text-white ml-2 flex-shrink-0">
                                                                {room.unreadCount}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}