import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = "md", shadow = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-2xl overflow-hidden transition-shadow",
          shadow === "none" && "shadow-none",
          shadow === "sm" && "shadow-sm",
          shadow === "md" && "shadow-md",
          shadow === "lg" && "shadow-lg",
          padding === "none" && "",
          padding === "sm" && "p-3",
          padding === "md" && "p-4 sm:p-5",
          padding === "lg" && "p-5 sm:p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-4", className)} {...props}>
        {children}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn("text-lg font-semibold text-gray-900", className)} {...props}>
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
