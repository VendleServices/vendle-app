import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2
      }
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn(
          "w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300",
          "border border-gray-100",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="mb-6 text-center"
          variants={contentVariants}
        >
          <h2 className="text-3xl font-bold text-vendle-navy mb-3 text-vendle-navy">
            {title}
          </h2>
          {subtitle && (
            <motion.p 
              className="text-vendle-navy/70 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
        
        <motion.div 
          className="mb-8"
          variants={contentVariants}
        >
          {children}
        </motion.div>
        
        <motion.div 
          className="flex justify-between items-center mt-8"
          variants={contentVariants}
        >
          {showBackButton ? (
            <motion.button
              onClick={onBack}
              className="group px-5 py-2.5 text-vendle-blue font-medium hover:bg-vendle-blue/5 rounded-lg transition-all flex items-center gap-2"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {backButtonLabel}
            </motion.button>
          ) : <div />}
          
          {showNextButton && (
            <motion.button
              onClick={onNext}
              disabled={isNextDisabled}
              className={cn(
                "group px-6 py-2.5 bg-vendle-blue text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2",
                isNextDisabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              )}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              {nextButtonLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingCard;
