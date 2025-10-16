import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { transactionService } from "@/services/api/transactionService";
import { formatCurrency } from "@/utils/formatters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const SpendingTrendChart = () => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("6months");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const loadChartData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const transactions = await transactionService.getAll();
      const months = getLastMonths(timeRange === "6months" ? 6 : 12);
      
      const monthlyData = months.map(month => {
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
          expenses
        };
      });

      setChartData(monthlyData);
    } catch (err) {
      setError("Failed to load trend data");
    } finally {
      setLoading(false);
    }
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
    return (
      <Card className="p-6">
        <Loading />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <Error message={error} onRetry={loadChartData} />
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <Empty 
          title="No data available"
          description="Add some transactions to see your spending trends"
        />
      </Card>
    );
  }

  const chartOptions = {
    chart: {
      type: "line",
      height: 400,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800
      }
    },
    colors: ["#10b981", "#ef4444"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 5
    },
    xaxis: {
      categories: chartData.map(d => d.month),
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif"
        },
        formatter: function(val) {
          return "$" + (val / 1000).toFixed(1) + "k";
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      markers: {
        width: 12,
        height: 12,
        radius: 6
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif"
      }
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColors: ["#ffffff"],
      hover: {
        size: 8
      }
    }
  };

  const series = [
    {
      name: "Income",
      data: chartData.map(d => d.income)
    },
    {
      name: "Expenses",
      data: chartData.map(d => d.expenses)
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Spending Trends</h3>
          <p className="text-sm text-slate-600">Income vs expenses over time</p>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={timeRange === "6months" ? "primary" : "secondary"}
            onClick={() => setTimeRange("6months")}
          >
            6 Months
          </Button>
          <Button
            size="sm"
            variant={timeRange === "12months" ? "primary" : "secondary"}
            onClick={() => setTimeRange("12months")}
          >
            12 Months
          </Button>
        </div>
      </div>
      <div className="w-full">
        <Chart
          options={chartOptions}
          series={series}
          type="line"
          height={400}
        />
      </div>
    </Card>
  );
};

export default SpendingTrendChart;