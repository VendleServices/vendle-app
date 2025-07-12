
import { cn } from '@/lib/utils';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

const ProgressBar = ({ currentStep, totalSteps, className }: ProgressBarProps) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1 flex justify-between items-center">
        <span className="text-sm text-vendle-navy/80">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-vendle-teal">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-vendle-gray/30 rounded-full h-2 overflow-hidden">
        <div 
          className="h-2 bg-vendle-teal rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
