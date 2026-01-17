"use client";

import { useState } from "react";
import { Calendar, Sparkles, Clock, Settings, CheckCircle, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAvailability } from "@/hooks/useBooking";
import AvailabilityManager from "@/components/AvailabilityManager";

interface Timeline {
    phase1Start: string;
    phase1End: string;
    phase2Start: string;
    phase2End: string;
}

interface Step5TimelineProps {
    timeline: Timeline;
    onTimelineChange: (field: keyof Timeline, value: string) => void;
    propertyAddress: string;
}

// Day mapping for display
const getDayLabel = (dayOfWeek: number): string => {
    const days: Record<number, string> = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday',
    };
    return days[dayOfWeek] || 'Unknown';
};

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export function Step5Timeline({
    timeline,
    onTimelineChange,
    propertyAddress
}: Step5TimelineProps) {
    const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
    const { data: availability, isLoading: availabilityLoading } = useGetAvailability();

    const hasAvailability = availability && availability.length > 0;

    return (
        <div className="space-y-8">
            {/* Phase 1 & 2 Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
            {/* Phase 1 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-vendle-gray/30">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-vendle-blue/10">
                        <Calendar className="w-5 h-5 text-vendle-blue" />
                    </div>
                    Phase 1 Timeline
                </h3>

                <div className="bg-vendle-teal/10 border border-vendle-teal/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-vendle-teal flex-shrink-0" />
                        <strong>Recommendation:</strong> 2 weeks for a competitive auction process
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Start Date</Label>
                        <Input
                            type="date"
                            value={timeline.phase1Start}
                            onChange={(e) => onTimelineChange("phase1Start", e.target.value)}
                            className="h-12 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">End Date</Label>
                        <Input
                            type="date"
                            value={timeline.phase1End}
                            onChange={(e) => onTimelineChange("phase1End", e.target.value)}
                            min={timeline.phase1Start}
                            className="h-12 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Phase 2 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-vendle-gray/30">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-vendle-teal/10">
                        <Calendar className="w-5 h-5 text-vendle-teal" />
                    </div>
                    Phase 2 Timeline
                </h3>

                <div className="bg-vendle-blue/10 border border-vendle-blue/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-vendle-blue flex-shrink-0" />
                        <strong>Recommendation:</strong> 1 week for a competitive auction process
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Start Date</Label>
                        <Input
                            type="date"
                            value={timeline.phase2Start}
                            onChange={(e) => onTimelineChange("phase2Start", e.target.value)}
                            min={timeline.phase1End}
                            className="h-12 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">End Date</Label>
                        <Input
                            type="date"
                            value={timeline.phase2End}
                            onChange={(e) => onTimelineChange("phase2End", e.target.value)}
                            min={timeline.phase2Start}
                            className="h-12 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                        />
                    </div>
                </div>
            </div>
            </div>

            {/* Contractor Site Visits - Availability Management */}
            <div className="p-6 rounded-2xl bg-vendle-blue/5 border-2 border-vendle-blue/20">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-vendle-blue/10">
                        <Calendar className="w-5 h-5 text-vendle-blue" />
                    </div>
                    Contractor Site Visits
                </h3>
                <p className="text-muted-foreground mb-6">
                    Set your availability so contractors can schedule site visits to provide accurate estimates
                </p>

                {availabilityLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vendle-blue" />
                    </div>
                ) : hasAvailability ? (
                    <div className="space-y-4">
                        {/* Summary of availability */}
                        <div className="bg-white rounded-xl border border-vendle-blue/20 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-semibold">
                                        {availability.length} time slot{availability.length !== 1 ? 's' : ''} configured
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAvailabilityManager(true)}
                                    className="text-vendle-blue hover:text-vendle-blue/80"
                                >
                                    <Settings className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {availability.slice(0, 3).map((slot) => (
                                    <div key={slot.id} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">{getDayLabel(slot.dayOfWeek)}:</span>
                                        <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                    </div>
                                ))}
                                {availability.length > 3 && (
                                    <p className="text-sm text-gray-500 pl-6">
                                        +{availability.length - 3} more slot{availability.length - 3 !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        type="button"
                        onClick={() => setShowAvailabilityManager(true)}
                        className="w-full h-14 rounded-xl bg-vendle-blue hover:shadow-2xl hover:shadow-vendle-blue/30 text-white font-semibold text-base"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Set Your Availability
                    </Button>
                )}
            </div>

            {/* Availability Manager Modal */}
            <AvailabilityManager
                isOpen={showAvailabilityManager}
                onClose={() => setShowAvailabilityManager(false)}
            />
        </div>
    );
}