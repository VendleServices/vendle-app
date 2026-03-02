"use client";

import { useState } from "react";
import { Calendar, Clock, Settings, CheckCircle, Plus } from "lucide-react";
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

const getDayLabel = (dayOfWeek: number): string => {
    const days: Record<number, string> = {
        1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun'
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
        <div className="space-y-4">
            {/* Phase 1 & 2 Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
                    {/* Phase 1 */}
                    <div className="p-4 rounded border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Phase 1</span>
                            <span className="text-[10px] text-gray-400 ml-auto">~2 weeks recommended</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs font-medium text-gray-600 mb-1 block">Start</Label>
                                <Input
                                    type="date"
                                    value={timeline.phase1Start}
                                    onChange={(e) => onTimelineChange("phase1Start", e.target.value)}
                                    className="h-8 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-gray-600 mb-1 block">End</Label>
                                <Input
                                    type="date"
                                    value={timeline.phase1End}
                                    onChange={(e) => onTimelineChange("phase1End", e.target.value)}
                                    min={timeline.phase1Start}
                                    className="h-8 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="p-4 rounded border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Phase 2</span>
                            <span className="text-[10px] text-gray-400 ml-auto">~1 week recommended</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs font-medium text-gray-600 mb-1 block">Start</Label>
                                <Input
                                    type="date"
                                    value={timeline.phase2Start}
                                    onChange={(e) => onTimelineChange("phase2Start", e.target.value)}
                                    min={timeline.phase1End}
                                    className="h-8 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-gray-600 mb-1 block">End</Label>
                                <Input
                                    type="date"
                                    value={timeline.phase2End}
                                    onChange={(e) => onTimelineChange("phase2End", e.target.value)}
                                    min={timeline.phase2Start}
                                    className="h-8 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contractor Site Visits */}
                <div className="p-4 rounded border border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Contractor Availability</span>
                        </div>
                        {hasAvailability && (
                            <button
                                type="button"
                                onClick={() => setShowAvailabilityManager(true)}
                                className="text-xs text-vendle-blue hover:underline flex items-center gap-1"
                            >
                                <Settings className="h-3 w-3" />
                                Edit
                            </button>
                        )}
                    </div>

                    {availabilityLoading ? (
                        <div className="flex items-center justify-center py-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
                        </div>
                    ) : hasAvailability ? (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                            <span>{availability.length} time slots configured</span>
                            <span className="text-gray-400">•</span>
                            {availability.slice(0, 2).map((slot, i) => (
                                <span key={slot.id} className="text-gray-500">
                                    {getDayLabel(slot.dayOfWeek)} {formatTime(slot.startTime)}{i < 1 && availability.length > 1 ? ',' : ''}
                                </span>
                            ))}
                            {availability.length > 2 && (
                                <span className="text-gray-400">+{availability.length - 2} more</span>
                            )}
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAvailabilityManager(true)}
                            className="h-8 text-xs rounded border-gray-200"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Set Availability
                        </Button>
                    )}
                </div>

            <AvailabilityManager
                isOpen={showAvailabilityManager}
                onClose={() => setShowAvailabilityManager(false)}
            />
        </div>
    );
}
