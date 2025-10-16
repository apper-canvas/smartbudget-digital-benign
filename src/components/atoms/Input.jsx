import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  type = "text", 
  className, 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;