"use client";

import { Wrench, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectTypeOption {
    value: string;
    label: string;
    description: string;
}

interface Step6ProjectTypeProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
}

const projectTypes: ProjectTypeOption[] = [
    { value: "full", label: "Full Reconstruction", description: "Complete rebuild of damaged structure" },
    { value: "partial", label: "Partial Rebuild", description: "Repair specific damaged areas" },
    { value: "new", label: "New Construction", description: "Build new, not disaster recovery" }
];

export function Step6ProjectType({ selectedType, onTypeChange }: Step6ProjectTypeProps) {
    return (
        <div className="grid sm:grid-cols-3 gap-2">
            {projectTypes.map((option) => {
                const isSelected = selectedType === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onTypeChange(option.value)}
                        className={cn(
                            "relative p-3 rounded border text-left transition-colors",
                            isSelected
                                ? "border-vendle-blue bg-vendle-blue/5"
                                : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center flex-shrink-0",
                                isSelected ? "bg-vendle-blue text-white" : "bg-gray-100 text-gray-500"
                            )}>
                                <Wrench className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                    {option.label}
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-vendle-blue" />
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    </button>
            );
        })}
        </div>
    );
}
