'use client';

import { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessModalProps {
  isOpen: boolean;
  onContinue: () => void;
  projectTitle: string;
}

export default function SuccessModal({
  isOpen,
  onContinue,
  projectTitle
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-continue after 3 seconds
      const timer = setTimeout(() => {
        onContinue();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onContinue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in-up">
        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-vendle-teal/10">
            <CheckCircle className="h-12 w-12 text-vendle-teal" />
          </div>

          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            NDA Signed Successfully!
          </h2>

          {/* Description */}
          <p className="mb-6 text-gray-600">
            You can now view the full details for{' '}
            <span className="font-semibold text-gray-900">{projectTitle}</span>
          </p>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
          >
            View Project Details
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Auto-redirect notice */}
          <p className="mt-4 text-xs text-gray-500">
            Redirecting automatically in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

