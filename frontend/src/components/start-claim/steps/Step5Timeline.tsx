"use client";

import { Calendar, ExternalLink, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export function Step5Timeline({
    timeline,
    onTimelineChange,
    propertyAddress
}: Step5TimelineProps) {
    const handleScheduleClick = () => {
        const calendlyUrl = `https://calendly.com/your-calendly-link?text=${encodeURIComponent(`Site Visit - ${propertyAddress}`)}`;
        window.open(calendlyUrl, '_blank');
    };

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

            {/* Contractor Site Visits */}
            <div className="p-6 rounded-2xl bg-vendle-blue/5 border-2 border-vendle-blue/20">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-vendle-blue/10">
                        <Calendar className="w-5 h-5 text-vendle-blue" />
                    </div>
                    Contractor Site Visits
                </h3>
                <p className="text-muted-foreground mb-6">
                    Schedule when contractors can visit your property to provide accurate estimates
                </p>

                <Button
                    type="button"
                    onClick={handleScheduleClick}
                    className="w-full h-14 rounded-xl bg-vendle-blue hover:shadow-2xl hover:shadow-vendle-blue/30 text-white font-semibold text-base"
                >
                    <Calendar className="h-5 w-5 mr-2" />
                    Open Calendly to Schedule Visits
                    <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
