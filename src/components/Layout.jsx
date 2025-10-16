import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSidebarOpen(true)}
                >
                  <ApperIcon name="Menu" className="w-5 h-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    SmartBudget
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;