"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface RAGChatbotProps {
  claimId: string;
}

export function RAGChatbot({ claimId }: RAGChatbotProps) {
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response: any = await apiService.get(`/api/chat/${claimId}`);
      return response?.existingChats;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: existingMessages, isLoading } = useQuery({
    queryKey: ["existingMessages", claimId],
    queryFn: fetchMessages,
  });

  const messages = useMemo(() => {
    const initialMessages = existingMessages ?? [];
    const mappedMessages: Message[] = [
      {
        id: "-1",
        text: "Hello! I'm your project assistant. I can help answer questions about this project, claims, bids, and more. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
      ...(initialMessages?.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === "USER" ? "user" : "bot",
        timestamp: new Date(msg?.createdAt || ""),
      })) || [])
    ];

    // Add pending user message if exists
    if (pendingMessage) {
      mappedMessages.push(pendingMessage);
    }

    // Add loading indicator if waiting for response
    if (isLoadingResponse) {
      mappedMessages.push({
        id: "loading",
        text: "...",
        sender: "bot",
        timestamp: new Date(),
      });
    }

    return mappedMessages;
  }, [existingMessages, pendingMessage, isLoadingResponse]);

  const handleSendMessage = async (messageText: string) => {
    try {
      const body = {
        question: messageText,
        existingChats: messages.filter(m => m.id !== "loading" && m.id !== "pending"),
      }

      const response: any = await apiService.post(`/api/chat/${claimId}`, body);
      return response?.answer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: handleSendMessage,
    onSuccess: () => {
      setPendingMessage(null);
      setIsLoadingResponse(false);
      queryClient.invalidateQueries({
        queryKey: ["existingMessages", claimId],
      })
    },
    onError: () => {
      setPendingMessage(null);
      setIsLoadingResponse(false);
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const messageText = inputValue.trim();

    // Immediately show user message
    setPendingMessage({
      id: "pending",
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    });

    // Clear input immediately
    setInputValue("");

    // Show loading state
    setIsLoadingResponse(true);

    // Send the message
    sendMessageMutation.mutate(messageText);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-vendle-blue text-white shadow-lg hover:bg-vendle-blue/90 transition-all duration-300 hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-2xl border-2 border-vendle-blue/20">
            <CardHeader className="border-b-2 border-vendle-gray/10 pb-4 bg-vendle-blue/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-vendle-blue/15">
                  <MessageCircle className="h-5 w-5 text-vendle-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Project Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Ask me anything</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-vendle-blue/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages Area */}
              <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-vendle-blue text-white"
                            : "bg-vendle-gray/10 text-foreground border border-vendle-gray/20"
                        }`}
                      >
                        {message.id === "loading" ? (
                          <div className="flex items-center gap-1 py-1">
                            <span className="w-2 h-2 bg-vendle-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-2 h-2 bg-vendle-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-2 h-2 bg-vendle-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "user"
                                  ? "text-white/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <form
                onSubmit={onSubmit}
                className="border-t-2 border-vendle-gray/10 p-4 bg-white"
              >
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border-vendle-gray/20 focus:border-vendle-blue"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-vendle-blue hover:bg-vendle-blue/90 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}