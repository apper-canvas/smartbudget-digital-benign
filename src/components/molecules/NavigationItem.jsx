import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavigationItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:shadow-md"
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            className={cn(
              "w-5 h-5 mr-3 transition-colors",
              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
            )} 
          />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className={cn(
              "ml-2 px-2 py-0.5 text-xs rounded-full font-medium",
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
            )}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;