import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className, 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-lg backdrop-blur-sm transition-all duration-200",
        hover && "hover:shadow-xl hover:scale-105 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
export default Card;