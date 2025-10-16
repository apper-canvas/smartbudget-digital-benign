import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
        <div className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
      </div>
      <div className="h-64 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
    </div>
  );
};

export default Loading;