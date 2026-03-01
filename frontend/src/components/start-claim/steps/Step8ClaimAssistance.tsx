"use client";

import { UserCheck, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Step8ClaimAssistanceProps {
    needsAdjuster: boolean | null;
    onAdjusterChange: (needs: boolean) => void;
}

export function Step8ClaimAssistance({ needsAdjuster, onAdjusterChange }: Step8ClaimAssistanceProps) {
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {/* Yes */}
            <button
                type="button"
                onClick={() => onAdjusterChange(true)}
                className={cn(
                    "relative p-4 rounded border text-left transition-colors",
                    needsAdjuster === true
                        ? "border-vendle-blue bg-vendle-blue/5"
                        : "border-gray-200 bg-white hover:border-gray-300"
                )}
            >
                <Badge className="absolute -top-2 left-3 bg-vendle-blue text-white text-[10px] px-1.5 py-0.5">
                    Recommended
                </Badge>

                <div className="flex items-start gap-3 pt-1">
                    <div className={cn(
                        "w-10 h-10 rounded flex items-center justify-center flex-shrink-0",
                        needsAdjuster === true ? "bg-vendle-blue text-white" : "bg-gray-100 text-gray-500"
                    )}>
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                            Yes, I need help
                            {needsAdjuster === true && <Check className="w-3.5 h-3.5 text-vendle-blue" />}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Get professional adjuster assistance to maximize your claim
                        </p>
                    </div>
                </div>
            </button>

            {/* No */}
            <button
                type="button"
                onClick={() => onAdjusterChange(false)}
                className={cn(
                    "relative p-4 rounded border text-left transition-colors",
                    needsAdjuster === false
                        ? "border-vendle-blue bg-vendle-blue/5"
                        : "border-gray-200 bg-white hover:border-gray-300"
                )}
            >
                <div className="flex items-start gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded flex items-center justify-center flex-shrink-0",
                        needsAdjuster === false ? "bg-vendle-blue text-white" : "bg-gray-100 text-gray-500"
                    )}>
                        <X className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                            No, I'll handle it
                            {needsAdjuster === false && <Check className="w-3.5 h-3.5 text-vendle-blue" />}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            I'm satisfied with my current insurance estimate
                        </p>
                    </div>
                </div>
            </button>
        </div>
    );
}
