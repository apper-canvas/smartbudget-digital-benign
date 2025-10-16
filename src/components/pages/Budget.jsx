import React from "react";
import BudgetManager from "@/components/organisms/BudgetManager";

const Budget = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Budget Management
        </h1>
        <p className="text-slate-600">Set spending limits and track your budget performance</p>
      </div>

      <BudgetManager />
    </div>
  );
};

export default Budget;