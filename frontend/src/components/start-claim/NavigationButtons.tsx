"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

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
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      {currentStep > 1 ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-9 px-4 text-sm rounded border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
      ) : (
        <div />
      )}

      <Button
        size="sm"
        onClick={onNext}
        disabled={!isValid || isSubmitting}
        className="h-9 px-4 text-sm rounded bg-vendle-blue hover:bg-vendle-blue/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            {isLastStep ? 'Submit' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </>
        )}
      </Button>
    </div>
  );
}
