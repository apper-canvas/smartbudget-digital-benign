import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    error: "bg-error-100 text-error-800",
    primary: "bg-primary-100 text-primary-800"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
export default Badge;