'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { pusherClient } from '@/lib/pusher';
import { useAuth } from "@/contexts/AuthContext";
import { useApiService } from '@/services/api';

interface Message {
    id: string;
    content: string;
    userId: string;
    createdAt: string;
    sender: { email: string };
}

export default function ChatRoom({ roomId }: { roomId: string }) {
    const { user } = useAuth();
    const apiService = useApiService();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    // Refs for UI and Debouncing
    const scrollRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch messages with useQuery
    const { data: initialMessages } = useQuery({
        queryKey: ['messages', roomId],
        queryFn: async () => {
            const response: any = await apiService.get(`/api/rooms/${roomId}/messages`);
            return response as Message[];
        },
        enabled: !!user?.id,
    });

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async () => {
            await apiService.post(`/api/rooms/${roomId}/read`, {});
        },
        onError: (err) => {
            console.error("Failed to update read status", err);
        }
    });

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: async (content: string) => {
            await apiService.post('/api/messages', { content, roomId });
        },
        onError: (err) => {
            console.error("Failed to send message", err);
        }
    });

    // Debounced mark as read
    const markAsRead = useCallback(() => {
        if (!user?.id) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            markAsReadMutation.mutate();
        }, 1000);
    }, [user?.id, markAsReadMutation]);

    // Set initial messages when fetched
    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
            markAsRead();
        }
    }, [initialMessages, markAsRead]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    // Pusher Subscription
    useEffect(() => {
        const channel = pusherClient.subscribe(`private-room-${roomId}`);

        channel.bind('new-message', (data: Message) => {
            setMessages((prev) => [...prev, data]);
            markAsRead();
        });

        return () => {
            pusherClient.unsubscribe(`private-room-${roomId}`);
            channel.unbind_all();
        };
    }, [roomId, markAsRead]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send Message Handler
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const contentToSend = newMessage;
        setNewMessage('');
        sendMessageMutation.mutate(contentToSend);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl border rounded-lg bg-white shadow mx-auto">
            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
                    >
                        <span className="text-[10px] text-gray-400 mb-1 px-1">{msg.sender.email}</span>
                        <div className={`px-4 py-2 rounded-2xl max-w-[85%] break-words ${
                            msg.userId === user?.id
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50 flex gap-2 rounded-b-lg">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

