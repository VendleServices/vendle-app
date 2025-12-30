"use client";

import { motion } from "framer-motion";
import { Check, MapPin, FileText, Droplets, Home, Calendar, Wrench, Sparkles, UserCheck, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

// Step configuration with icons
const steps: Step[] = [
  {
    id: 1,
    title: "Property Location",
    description: "Tell us where the property is located",
    icon: MapPin
  },
  {
    id: 2,
    title: "Restoration Details",
    description: "Upload your insurance estimate and financial details",
    icon: FileText
  },
  {
    id: 3,
    title: "Damage Types",
    description: "Select all types of damage to the property",
    icon: Droplets
  },
  {
    id: 4,
    title: "Property Information",
    description: "Answer questions about the property condition",
    icon: Home
  },
  {
    id: 5,
    title: "Timeline",
    description: "Set your project timeline and contractor visit days",
    icon: Calendar
  },
  {
    id: 6,
    title: "Project Type",
    description: "Choose your reconstruction approach",
    icon: Wrench
  },
  {
    id: 7,
    title: "Design Plan",
    description: "Select your design preferences",
    icon: Sparkles
  },
  {
    id: 8,
    title: "Claim Assistance",
    description: "Decide if you need adjuster help",
    icon: UserCheck
  }
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8 lg:mb-12">
      {/* Desktop stepper - shows all steps horizontally */}
      <div className="hidden lg:flex items-center justify-between max-w-5xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;
          const isUpcoming = currentStep < index + 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <motion.div
                layoutId={isCurrent ? "active-step" : undefined}
                className={cn(
                  "relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all",
                  isCompleted && "bg-vendle-teal shadow-lg shadow-vendle-teal/30",
                  isCurrent && "bg-gradient-to-br from-vendle-blue to-vendle-teal shadow-xl shadow-vendle-blue/40 ring-4 ring-vendle-blue/20 animate-pulse",
                  isUpcoming && "bg-vendle-gray/30 border-2 border-vendle-gray/50"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <step.icon className={cn(
                    "w-6 h-6",
                    isCurrent ? "text-white" : "text-vendle-gray"
                  )} />
                )}
              </motion.div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-vendle-gray/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-vendle-blue to-vendle-teal"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile stepper - compact version with just current step highlighted */}
      <div className="lg:hidden flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div
              key={step.id}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                isCompleted && "bg-vendle-teal",
                isCurrent && "bg-gradient-to-br from-vendle-blue to-vendle-teal ring-4 ring-vendle-blue/20",
                !isCompleted && !isCurrent && "bg-vendle-gray/30 border-2 border-vendle-gray/50"
              )}
            >
              {isCompleted ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <step.icon className={cn(
                  "w-5 h-5",
                  isCurrent ? "text-white" : "text-vendle-gray"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step title and description */}
      <div className="text-center mt-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          {steps[currentStep - 1].title}
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground mt-2">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
}
