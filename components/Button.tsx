import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "touch";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "touch", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles - large touch targets for mobile
          "inline-flex items-center justify-center font-semibold transition-all",
          "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          "rounded-xl shadow-sm",
          
          // Size variants - touch is mobile-optimized
          size === "sm" && "h-10 px-3 text-sm",
          size === "md" && "h-12 px-4 text-base",
          size === "lg" && "h-14 px-6 text-lg",
          size === "touch" && "min-h-14 px-4 py-3 text-base sm:text-lg",
          
          // Color variants
          variant === "primary" && 
            "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
          variant === "secondary" && 
            "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300",
          variant === "danger" && 
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
          variant === "ghost" && 
            "bg-transparent text-gray-700 hover:bg-gray-100 shadow-none",
          
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
