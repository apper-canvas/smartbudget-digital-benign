import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200",
    success: "bg-gradient-to-br from-success-50 to-success-100 border-success-200",
    warning: "bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200",
    error: "bg-gradient-to-br from-error-50 to-error-100 border-error-200"
  };

  const iconColors = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    error: "text-error-600"
  };

  return (
    <Card className={cn("p-6", colorClasses[color], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trend === "up" ? "text-success-600" : trend === "down" ? "text-error-600" : "text-slate-600"
            )}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4 mr-1" 
              />
              {trendValue}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("p-3 rounded-full bg-white/60 backdrop-blur-sm", iconColors[color])}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;