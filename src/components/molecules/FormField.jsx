import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  children,
  className,
  ...props 
}) => {
  const renderInput = () => {
    if (children) return children;
    if (type === "select") return <Select {...props} />;
    return <Input type={type} {...props} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;