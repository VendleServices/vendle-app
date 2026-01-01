"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isValid,
  isSubmitting = false
}: NavigationButtonsProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between gap-6 mt-10 lg:mt-12 pt-8 border-t-2 border-vendle-gray/20">
      {/* Back button */}
      {currentStep > 1 && (
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
          className="group border-2 h-12 lg:h-14 px-6 lg:px-8 hover:border-vendle-blue hover:bg-vendle-blue/5"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </Button>
      )}

      {/* Spacer if no back button */}
      {currentStep === 1 && <div />}

      {/* Progress badge (center, desktop only) */}
      <div className="hidden md:flex items-center gap-2 mx-4">
        <Badge variant="outline" className="px-4 py-2 text-sm border-vendle-blue/30 bg-white">
          Step {currentStep} of {totalSteps}
        </Badge>
      </div>

      {/* Continue button */}
      <Button
        size="lg"
        onClick={onNext}
        disabled={!isValid || isSubmitting}
        className="ml-auto group relative overflow-hidden bg-vendle-blue hover:bg-vendle-blue/90 h-12 lg:h-14 px-6 lg:px-8 shadow-lg hover:shadow-2xl hover:shadow-vendle-blue/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 font-semibold">
          {isSubmitting
            ? 'Submitting...'
            : isLastStep
            ? 'Submit Claim'
            : 'Continue'}
        </span>
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
      </Button>
    </div>
  );
}
