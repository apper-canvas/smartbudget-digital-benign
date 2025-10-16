import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none pr-8",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" 
      />
    </div>
  );
});

Select.displayName = "Select";
export default Select;