import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Contractor {
    id: string;
    name: string;
    company: string;
    rating: number;
    reviews: number;
    avatar: string;
    specialties: string[];
    availability: {
        date: Date;
        timeSlots: string[];
    }[];
}

const mockContractors: Contractor[] = [
    {
        id: "1",
        name: "John Smith",
        company: "Elite Restoration",
        rating: 4.8,
        reviews: 127,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        specialties: ["Water Damage", "Fire Restoration", "Mold Remediation"],
        availability: [
            {
                date: new Date(),
                timeSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
            },
            {
                date: new Date(Date.now() + 86400000), // tomorrow
                timeSlots: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]
            },
            {
                date: new Date(Date.now() + 172800000), // day after tomorrow
                timeSlots: ["8:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"]
            }
        ]
    },
    {
        id: "2",
        name: "Sarah Johnson",
        company: "Premier Builders",
        rating: 4.9,
        reviews: 89,
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        specialties: ["Structural Repair", "Water Damage", "Emergency Services"],
        availability: [
            {
                date: new Date(),
                timeSlots: ["10:00 AM", "1:00 PM", "4:00 PM"]
            },
            {
                date: new Date(Date.now() + 86400000), // tomorrow
                timeSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
            },
            {
                date: new Date(Date.now() + 172800000), // day after tomorrow
                timeSlots: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]
            }
        ]
    }
];

export default function ScheduleCleanupPage() {
    const navigate = useNavigate();
    const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleSchedule = () => {
        if (selectedContractor && selectedDate && selectedTime) {
            // TODO: Implement actual scheduling logic
            console.log("Scheduling with:", {
                contractor: selectedContractor.name,
                date: selectedDate,
                time: selectedTime
            });
            navigate("/my-projects");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Schedule Cleanup Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Contractor Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Select a Contractor</h3>
                        <div className="grid gap-4">
                            {mockContractors.map((contractor) => (
                                <Card
                                    key={contractor.id}
                                    className={cn(
                                        "p-4 cursor-pointer transition-all",
                                        selectedContractor?.id === contractor.id
                                            ? "border-2 border-[#1a365d]"
                                            : "hover:border-[#1a365d]"
                                    )}
                                    onClick={() => setSelectedContractor(contractor)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={contractor.avatar} />
                                            <AvatarFallback>{contractor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{contractor.name}</h4>
                                            <p className="text-sm text-gray-500">{contractor.company}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-sm ml-1">{contractor.rating} ({contractor.reviews} reviews)</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {contractor.specialties.map((specialty, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Date and Time Selection */}
                    {selectedContractor && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Select Date and Time</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Select Date</h4>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-md border"
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const dateToCheck = new Date(date);
                                            dateToCheck.setHours(0, 0, 0, 0);
                                            return dateToCheck < today;
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Select Time</h4>
                                    {selectedDate && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                {(() => {
                                                    const selectedDateStr = selectedDate.toISOString().split('T')[0];
                                                    const availableSlots = selectedContractor.availability.find(avail => 
                                                        avail.date.toISOString().split('T')[0] === selectedDateStr
                                                    );
                                                    
                                                    if (!availableSlots) {
                                                        return (
                                                            <div className="col-span-3 text-center py-4 text-gray-500">
                                                                No available time slots for this date
                                                            </div>
                                                        );
                                                    }

                                                    return availableSlots.timeSlots.map((time) => (
                                                        <Button
                                                            key={time}
                                                            variant={selectedTime === time ? "default" : "outline"}
                                                            className={cn(
                                                                "w-full",
                                                                selectedTime === time
                                                                    ? "bg-[#1a365d] text-white"
                                                                    : "text-[#1a365d] border-[#1a365d] hover:bg-[#1a365d] hover:text-white"
                                                            )}
                                                            onClick={() => setSelectedTime(time)}
                                                        >
                                                            {time}
                                                        </Button>
                                                    ));
                                                })()}
                                            </div>
                                            {selectedTime && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                    <h5 className="font-medium mb-2">Selected Appointment</h5>
                                                    <p className="text-sm text-gray-600">
                                                        {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        with {selectedContractor.name} from {selectedContractor.company}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/my-projects")}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                            onClick={handleSchedule}
                            disabled={!selectedContractor || !selectedDate || !selectedTime}
                        >
                            Schedule Service
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 