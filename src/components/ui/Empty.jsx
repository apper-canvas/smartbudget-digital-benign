import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, description, action, icon = "Inbox" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title || "No data available"}
      </h3>
      <p className="text-slate-600 text-center mb-6 max-w-md">
        {description || "There's nothing to display here yet. Start by adding some data."}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default Empty;