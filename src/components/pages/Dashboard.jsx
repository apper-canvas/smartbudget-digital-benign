import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import ExpensePieChart from "@/components/organisms/ExpensePieChart";
import SpendingTrendChart from "@/components/organisms/SpendingTrendChart";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";
import { savingsGoalService } from "@/services/api/savingsGoalService";
import { formatCurrency, getCurrentMonth } from "@/utils/formatters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    remainingBudget: 0,
    savingsProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const currentMonth = getCurrentMonth();
      const [transactions, budgets, goals] = await Promise.all([
        transactionService.getByMonth(currentMonth),
        budgetService.getByMonth(currentMonth),
        savingsGoalService.getAll()
      ]);

      const monthlyIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = Math.abs(transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0));

      const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
      const remainingBudget = totalBudget - monthlyExpenses;

      const totalSavingsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalSavingsCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
      const savingsProgress = totalSavingsTarget > 0 
        ? (totalSavingsCurrent / totalSavingsTarget) * 100 
        : 0;

      setDashboardData({
        monthlyIncome,
        monthlyExpenses,
        remainingBudget,
        savingsProgress
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Financial Dashboard
        </h1>
        <p className="text-slate-600">Get an overview of your financial health and progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Income"
          value={formatCurrency(dashboardData.monthlyIncome)}
          icon="TrendingUp"
          color="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(dashboardData.monthlyExpenses)}
          icon="TrendingDown"
          color="error"
        />
        <StatCard
          title="Budget Remaining"
          value={formatCurrency(dashboardData.remainingBudget)}
          icon="PieChart"
          color={dashboardData.remainingBudget >= 0 ? "success" : "error"}
        />
        <StatCard
          title="Savings Progress"
          value={`${dashboardData.savingsProgress.toFixed(0)}%`}
          icon="Target"
          color="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ExpensePieChart />
        <SpendingTrendChart />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/transactions"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Add Transaction</h4>
              <p className="text-sm text-slate-600">Record income or expense</p>
            </div>
          </a>

          <a
            href="/budget"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Set Budget</h4>
              <p className="text-sm text-slate-600">Manage spending limits</p>
            </div>
          </a>

          <a
            href="/goals"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Create Goal</h4>
              <p className="text-sm text-slate-600">Plan for the future</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;