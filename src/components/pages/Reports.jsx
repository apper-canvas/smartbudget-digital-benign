import React, { useEffect, useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Chart from "react-apexcharts";
import { transactionService } from "@/services/api/transactionService";
import { formatCurrency } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from 'react-toastify';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transaction data");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const months = getLastMonths(timeRange === "6months" ? 6 : 12);
    return months.map(month => {
      const monthTransactions = transactions.filter(t => {
        const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
        return transactionMonth === month.key;
      });

      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = Math.abs(monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0));

      return {
        month: month.label,
        income,
        expenses,
        net: income - expenses
      };
    });
  };

  const getCategoryBreakdown = () => {
    const categoryTotals = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, transaction) => {
        const category = transaction.category;
        acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
        return acc;
      }, {});

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getLastMonths = (count) => {
    const months = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: date.toISOString().slice(0, 7),
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      });
    }
    
    return months;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTransactions} />;
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Financial Reports
          </h1>
          <p className="text-slate-600">Analyze your spending patterns and financial trends</p>
        </div>
        <Empty
          title="No transaction data available"
          description="Add some transactions to generate detailed financial reports and insights"
          icon="BarChart3"
        />
      </div>
    );
  }

  const filteredData = getFilteredData();
  const categoryData = getCategoryBreakdown();

  const overviewChartOptions = {
    chart: {
      type: "line",
      height: 400,
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 }
    },
    colors: ["#10b981", "#ef4444", "#3b82f6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 5 },
    xaxis: {
      categories: filteredData.map(d => d.month),
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontFamily: "Inter, sans-serif" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontFamily: "Inter, sans-serif" },
        formatter: function(val) {
          return "$" + (val / 1000).toFixed(1) + "k";
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      fontFamily: "Inter, sans-serif"
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    }
  };

  const overviewSeries = [
    { name: "Income", data: filteredData.map(d => d.income) },
    { name: "Expenses", data: filteredData.map(d => d.expenses) },
    { name: "Net", data: filteredData.map(d => d.net) }
  ];

  const categoryChartOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false }
    },
    colors: ["#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4", "#64748b", "#10b981"],
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4 }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categoryData.slice(0, 10).map(d => d.category),
      labels: {
        formatter: function(val) {
          return "$" + (val / 1000).toFixed(1) + "k";
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    }
  };

  const categorySeries = [
    {
      name: "Total Spent",
      data: categoryData.slice(0, 10).map(d => d.amount)
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Financial Reports
          </h1>
          <p className="text-slate-600">Analyze your spending patterns and financial trends</p>
        </div>
        
        <div className="flex space-x-3">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </Select>
          
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="categories">Categories</option>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(() => {
          const totalIncome = filteredData.reduce((sum, d) => sum + d.income, 0);
          const totalExpenses = filteredData.reduce((sum, d) => sum + d.expenses, 0);
          const avgMonthlyIncome = totalIncome / filteredData.length;
          const avgMonthlyExpenses = totalExpenses / filteredData.length;

          return (
            <>
              <Card className="p-6 bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-success-700 mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-success-900">{formatCurrency(totalIncome)}</p>
                  </div>
                  <ApperIcon name="TrendingUp" className="w-8 h-8 text-success-600" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-error-50 to-error-100 border-error-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-error-700 mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-error-900">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <ApperIcon name="TrendingDown" className="w-8 h-8 text-error-600" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-700 mb-1">Avg Monthly Income</p>
                    <p className="text-2xl font-bold text-primary-900">{formatCurrency(avgMonthlyIncome)}</p>
                  </div>
                  <ApperIcon name="BarChart3" className="w-8 h-8 text-primary-600" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warning-700 mb-1">Avg Monthly Expenses</p>
                    <p className="text-2xl font-bold text-warning-900">{formatCurrency(avgMonthlyExpenses)}</p>
                  </div>
                  <ApperIcon name="PieChart" className="w-8 h-8 text-warning-600" />
                </div>
              </Card>
            </>
          );
        })()}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {reportType === "overview" ? (
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Income vs Expenses Trend</h3>
              <p className="text-sm text-slate-600">Track your financial performance over time</p>
            </div>
            <Chart
              options={overviewChartOptions}
              series={overviewSeries}
              type="line"
              height={400}
            />
          </Card>
        ) : (
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Top Spending Categories</h3>
              <p className="text-sm text-slate-600">See where your money goes the most</p>
            </div>
            <Chart
              options={categoryChartOptions}
              series={categorySeries}
              type="bar"
              height={400}
            />
          </Card>
        )}
      </div>

      {/* Export Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Export Reports</h3>
            <p className="text-sm text-slate-600">Download your financial data for external analysis</p>
          </div>
          <div className="flex space-x-3">
<Button variant="secondary" onClick={() => toast.info("CSV export functionality coming soon")}>
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
<Button variant="secondary" onClick={() => toast.info("PDF export functionality coming soon")}>
              <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;