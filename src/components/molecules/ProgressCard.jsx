import React from "react";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const ProgressCard = ({ 
  title, 
  current, 
  target, 
  percentage, 
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500"
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">
            ${current.toLocaleString()} of ${target.toLocaleString()}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">{percentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                colorClasses[color],
                color === "primary" && "from-primary-500 to-primary-600",
                color === "success" && "from-success-500 to-success-600",
                color === "warning" && "from-warning-500 to-warning-600",
                color === "error" && "from-error-500 to-error-600"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;