import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, File, Send } from "lucide-react";
import { Job, ChatMessage } from "../types";

interface ChatModalProps {
  job: Job | null;
  messages: ChatMessage[];
  newMessage: string;
  attachments: File[];
  hasJobDetailPanel: boolean;
  onClose: () => void;
  onSendMessage: () => void;
  onMessageChange: (message: string) => void;
  onAddAttachment: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
}

export function ChatModal({
  job,
  messages,
  newMessage,
  attachments,
  hasJobDetailPanel,
  onClose,
  onSendMessage,
  onMessageChange,
  onAddAttachment,
  onRemoveAttachment
}: ChatModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!job) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onAddAttachment(files);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-[60] flex flex-col transition-all duration-300 ${hasJobDetailPanel ? 'right-[calc(50%+24px)]' : 'right-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Chat with {job.homeownerName}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 pr-4 min-h-0">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'contractor' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === 'contractor'
                  ? 'bg-vendle-blue text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{msg.message}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs opacity-90"
                      >
                        <File className="h-3 w-3" />
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                        >
                          {attachment.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <p className={`text-xs mt-1 ${
                  msg.sender === 'contractor' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="border-t pt-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-sm"
              >
                <File className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{file.name}</span>
                <button
                  onClick={() => onRemoveAttachment(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t pt-4 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0"
        >
          <File className="h-4 w-4" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          onClick={onSendMessage}
          disabled={!newMessage.trim() && attachments.length === 0}
          className="bg-vendle-blue hover:bg-vendle-blue/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
