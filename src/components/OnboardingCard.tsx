
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type OnboardingCardProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  isActive?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  showBackButton?: boolean;
  nextButtonLabel?: string;
  backButtonLabel?: string;
  isNextDisabled?: boolean;
  showNextButton?: boolean;
};

const OnboardingCard = ({
  children,
  title,
  subtitle,
  className,
  isActive = true,
  onBack,
  onNext,
  showBackButton = true,
  nextButtonLabel = "Continue",
  backButtonLabel = "Back",
  isNextDisabled = false,
  showNextButton = true,
}: OnboardingCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30, 
        duration: 0.4 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      className={cn(
        "w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 shadow-medium",
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-vendle-navy mb-2">{title}</h2>
        {subtitle && <p className="text-vendle-navy/70">{subtitle}</p>}
      </div>
      
      <div className="mb-8">
        {children}
      </div>
      
      <div className="flex justify-between items-center mt-8">
        {showBackButton ? (
          <button
            onClick={onBack}
            className="px-5 py-2 text-vendle-blue font-medium hover:bg-vendle-blue/5 rounded-lg transition-colors"
          >
            {backButtonLabel}
          </button>
        ) : <div />}
        
        {showNextButton && (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className={cn(
              "px-6 py-2.5 bg-vendle-blue text-white font-medium rounded-lg shadow-subtle transition-all",
              isNextDisabled 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-vendle-blue/90 hover:shadow-medium"
            )}
          >
            {nextButtonLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default OnboardingCard;
