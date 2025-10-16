import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h3>
      <p className="text-slate-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading your data. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;