"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    Calendar, 
    Clock, 
    MessageSquare, 
    Users, 
    MapPin, 
    Phone,
    CheckCircle,
    XCircle,
    Send,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

interface TimeSlot {
    id: string;
    date: string;
    time: string;
    duration: string;
    available: boolean;
    bookedBy?: string;
}

interface Message {
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
    isContractor: boolean;
}

export default function DueDiligencePage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [newMessage, setNewMessage] = useState("");
    const [isHomeowner, setIsHomeowner] = useState(true); // Toggle between homeowner/contractor view

    // Sample time slots data
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
        { id: "1", date: "2024-01-15", time: "09:00 AM", duration: "2 hours", available: true },
        { id: "2", date: "2024-01-15", time: "11:00 AM", duration: "2 hours", available: true },
        { id: "3", date: "2024-01-15", time: "02:00 PM", duration: "2 hours", available: false, bookedBy: "ABC Contractors" },
        { id: "4", date: "2024-01-16", time: "10:00 AM", duration: "2 hours", available: true },
        { id: "5", date: "2024-01-16", time: "01:00 PM", duration: "2 hours", available: true },
        { id: "6", date: "2024-01-17", time: "09:00 AM", duration: "2 hours", available: true },
    ]);

    // Sample conversation data
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", sender: "John Smith", message: "Hi, I'm available for the 2 PM slot on Monday. Can we discuss the scope of work?", timestamp: new Date(), isContractor: true },
        { id: "2", sender: "Homeowner", message: "Perfect! I'll be there. The main areas to inspect are the kitchen and living room.", timestamp: new Date(), isContractor: false },
        { id: "3", sender: "John Smith", message: "Great, I'll bring my inspection tools. Should I call when I arrive?", timestamp: new Date(), isContractor: true },
    ]);

    const handleBookSlot = (slotId: string) => {
        setTimeSlots(prev => prev.map(slot => 
            slot.id === slotId 
                ? { ...slot, available: false, bookedBy: isHomeowner ? "Homeowner" : "ABC Contractors" }
                : slot
        ));
        setSelectedTimeSlot(slotId);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: Date.now().toString(),
                sender: isHomeowner ? "Homeowner" : "ABC Contractors",
                message: newMessage,
                timestamp: new Date(),
                isContractor: !isHomeowner
            };
            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
    };

    const handleContinue = () => {
        router.push("/start-claim/inspection");
    };

    const availableDates = ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-center p-4 mt-8"
        >
            <Card className="w-[90vw] min-w-[60rem] max-w-[80rem] bg-white">
                <div className="p-12">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center text-vendle-navy">
                            Coordinate and Schedule On-Site Due Diligence
                        </CardTitle>
                        <p className="text-center text-lg text-gray-600 mt-4">
                            Schedule inspection time slots and coordinate with contractors
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-8">
                        {/* Role Toggle */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 rounded-lg p-1">
                                <Button
                                    variant={isHomeowner ? "default" : "ghost"}
                                    onClick={() => setIsHomeowner(true)}
                                    className="rounded-md"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Homeowner View
                                </Button>
                                <Button
                                    variant={!isHomeowner ? "default" : "ghost"}
                                    onClick={() => setIsHomeowner(false)}
                                    className="rounded-md"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Contractor View
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Calendar and Time Slots */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="h-6 w-6 text-vendle-blue" />
                                    <h3 className="text-xl font-semibold text-vendle-navy">
                                        {isHomeowner ? "Available Time Slots" : "Schedule Inspection"}
                                    </h3>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <Label className="text-lg font-medium">Select Date:</Label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {availableDates.map((date) => (
                                            <Button
                                                key={date}
                                                variant={selectedDate === date ? "default" : "outline"}
                                                onClick={() => setSelectedDate(date)}
                                                className="h-12 text-sm"
                                            >
                                                {new Date(date).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                {selectedDate && (
                                    <div className="space-y-3">
                                        <Label className="text-lg font-medium">Available Times:</Label>
                                        <div className="space-y-2">
                                            {timeSlots
                                                .filter(slot => slot.date === selectedDate)
                                                .map((slot) => (
                                                    <div
                                                        key={slot.id}
                                                        className={`p-4 border-2 rounded-lg ${
                                                            slot.available 
                                                                ? 'border-vendle-blue/30 hover:border-vendle-blue/50' 
                                                                : 'border-gray-300 bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Clock className="h-5 w-5 text-vendle-blue" />
                                                                <div>
                                                                    <p className="font-medium">{slot.time}</p>
                                                                    <p className="text-sm text-gray-600">{slot.duration}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {slot.available ? (
                                                                    <Button
                                                                        onClick={() => handleBookSlot(slot.id)}
                                                                        size="sm"
                                                                        className="bg-vendle-navy hover:bg-vendle-navy/90"
                                                                    >
                                                                        {isHomeowner ? "Book Slot" : "Schedule"}
                                                                    </Button>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                                            Booked
                                                                        </Badge>
                                                                        <span className="text-sm text-gray-600">by {slot.bookedBy}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Location Information */}
                                <div className="bg-vendle-blue/5 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-5 w-5 text-vendle-blue" />
                                        <h4 className="font-medium">Inspection Location</h4>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        123 Main Street, Anytown, ST 12345
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Please call when you arrive at the property
                                    </p>
                                </div>
                            </div>

                            {/* In-App Conversation Tool */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="h-6 w-6 text-vendle-blue" />
                                    <h3 className="text-xl font-semibold text-vendle-navy">
                                        Project Communication
                                    </h3>
                                </div>

                                {/* Messages */}
                                <div className="border-2 border-vendle-blue/20 rounded-lg h-96 flex flex-col">
                                    <div className="p-4 border-b border-vendle-blue/20 bg-vendle-blue/5">
                                        <h4 className="font-medium text-vendle-navy">Project Chat</h4>
                                        <p className="text-sm text-gray-600">Coordinate inspection details</p>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isContractor ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div
                                                    className={`max-w-xs p-3 rounded-lg ${
                                                        message.isContractor
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-vendle-blue text-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium">
                                                            {message.sender}
                                                        </span>
                                                        <span className="text-xs opacity-70">
                                                            {message.timestamp.toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">{message.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-vendle-blue/20">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="flex-1"
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                size="sm"
                                                className="bg-vendle-navy hover:bg-vendle-navy/90"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => setNewMessage("I'll be there at the scheduled time.")}
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Confirm Attendance
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => setNewMessage("Can we reschedule? I have a conflict.")}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Request Reschedule
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center space-x-6 pt-8">
                            <Button
                                onClick={() => router.back()}
                                className="px-12 py-6 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xl"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleContinue}
                                className="px-12 py-6 bg-vendle-navy text-white hover:bg-vendle-navy/90 text-xl"
                            >
                                Continue to Inspection
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
} 