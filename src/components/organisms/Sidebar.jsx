import React from "react";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/transactions", icon: "Receipt", label: "Transactions" },
    { to: "/budget", icon: "PieChart", label: "Budget" },
    { to: "/goals", icon: "Target", label: "Goals" },
    { to: "/reports", icon: "BarChart3", label: "Reports" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Wallet" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  SmartBudget
                </h1>
                <p className="text-xs text-slate-500">Personal Finance</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
                  <p className="text-xs text-slate-500">Premium User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-64 bg-white shadow-2xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  SmartBudget
                </h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                />
              ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
              <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">John Doe</p>
                    <p className="text-xs text-slate-500">Premium User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;