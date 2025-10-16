import React from "react";
import SavingsGoalManager from "@/components/organisms/SavingsGoalManager";

const Goals = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Savings Goals
        </h1>
        <p className="text-slate-600">Set financial targets and track your progress toward achieving them</p>
      </div>

      <SavingsGoalManager />
    </div>
  );
};

export default Goals;