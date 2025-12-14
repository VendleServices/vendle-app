import React from 'react';
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className, 
    icon, 
    iconPosition = 'left',
    loading = false,
    disabled = false,
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-vendle-blue/20 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg";
    
    // Variant styles
    const variantStyles = {
      primary: "bg-vendle-blue text-white hover:bg-vendle-blue/90 shadow-subtle hover:shadow-medium active:shadow-inner-subtle",
      secondary: "bg-vendle-teal text-white hover:bg-vendle-teal/90 shadow-subtle hover:shadow-medium active:shadow-inner-subtle",
      outline: "bg-transparent border border-vendle-blue text-vendle-blue hover:bg-vendle-blue/10",
      ghost: "bg-transparent text-vendle-blue hover:bg-vendle-blue/10",
    };
    
    // Size styles
    const sizeStyles = {
      sm: "text-sm px-3 py-1.5",
      md: "px-6 py-2.5",
      lg: "text-lg px-8 py-3",
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          loading && "relative text-transparent transition-none hover:text-transparent",
          disabled && "opacity-70 cursor-not-allowed",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        <span className={cn("flex items-center gap-2", loading && "invisible")}>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
