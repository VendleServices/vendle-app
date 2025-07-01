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
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth, format } from 'date-fns';

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
    const [isHomeowner, setIsHomeowner] = useState(true); // Toggle between homeowner/contractor view
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [newMessage, setNewMessage] = useState("");

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

    // Calendar helpers
    const handleDateClick = (date: Date) => {
        setSelectedDates(prev => {
            const exists = prev.some(d => isSameDay(d, date));
            if (exists) {
                return prev.filter(d => !isSameDay(d, date));
            } else {
                return [...prev, date];
            }
        });
    };
    const goToPrevMonth = () => setCalendarMonth(prev => addDays(startOfMonth(prev), -1));
    const goToNextMonth = () => setCalendarMonth(prev => addDays(endOfMonth(prev), 1));

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

                        {isHomeowner ? (
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-4">
                                    <Button variant="ghost" onClick={goToPrevMonth}><ChevronLeft /></Button>
                                    <h2 className="text-2xl font-semibold text-vendle-navy">{format(calendarMonth, 'MMMM yyyy')}</h2>
                                    <Button variant="ghost" onClick={goToNextMonth}><ChevronRight /></Button>
                                </div>
                                <div className="grid grid-cols-7 gap-2 w-full max-w-4xl mb-6">
                                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                                        <div key={day} className="text-center font-bold text-gray-500">{day}</div>
                                    ))}
                                    {(() => {
                                        const start = startOfWeek(startOfMonth(calendarMonth));
                                        const end = endOfWeek(endOfMonth(calendarMonth));
                                        const days = [];
                                        let day = start;
                                        while (day <= end) {
                                            days.push(new Date(day));
                                            day = addDays(day, 1);
                                        }
                                        return days.map(date => (
                                            <button
                                                key={date.toISOString()}
                                                className={`h-20 w-full rounded-lg border-2 flex flex-col items-center justify-center text-lg font-medium transition-colors
                                                    ${isSameMonth(date, calendarMonth) ? 'bg-white' : 'bg-gray-100'}
                                                    ${selectedDates.some(d => isSameDay(d, date)) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-700'}
                                                    hover:border-blue-400 hover:bg-blue-50`}
                                                onClick={() => handleDateClick(date)}
                                                type="button"
                                            >
                                                {date.getDate()}
                                            </button>
                                        ));
                                    })()}
                                </div>
                                <Button className="px-8 py-4 text-lg font-semibold bg-vendle-navy text-white hover:bg-vendle-navy/90" onClick={() => alert('Availability saved!')}>
                                    Save Availability
                                </Button>
                            </div>
                        ) : (
                            <div>Contractor view coming soon.</div>
                        )}

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