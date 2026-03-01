"use client";

import { Check, MapPin, FileText, Droplets, Home, Calendar, Wrench, Sparkles, UserCheck, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps: Step[] = [
  { id: 1, title: "Location", icon: MapPin },
  { id: 2, title: "Details", icon: FileText },
  { id: 3, title: "Damage", icon: Droplets },
  { id: 4, title: "Property", icon: Home },
  { id: 5, title: "Timeline", icon: Calendar },
  { id: 6, title: "Project", icon: Wrench },
  { id: 7, title: "Design", icon: Sparkles },
  { id: 8, title: "Assistance", icon: UserCheck }
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div
              key={step.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                isCompleted && "bg-vendle-blue",
                isCurrent && "bg-vendle-blue",
                !isCompleted && !isCurrent && "bg-gray-200"
              )}
            />
          );
        })}
      </div>

      {/* Step info */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">
            Step {currentStep} of {totalSteps}
          </p>
          <h2 className="text-base font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index + 1;
            const isCurrent = currentStep === index + 1;

            return (
              <div
                key={step.id}
                className={cn(
                  "w-7 h-7 rounded flex items-center justify-center transition-colors",
                  isCompleted && "bg-vendle-blue text-white",
                  isCurrent && "bg-gray-900 text-white",
                  !isCompleted && !isCurrent && "bg-gray-100 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <step.icon className="w-3.5 h-3.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
