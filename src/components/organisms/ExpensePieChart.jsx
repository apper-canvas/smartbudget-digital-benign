import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import { transactionService } from "@/services/api/transactionService";
import { getCurrentMonth } from "@/utils/formatters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ExpensePieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const currentMonth = getCurrentMonth();
      const transactions = await transactionService.getByMonth(currentMonth);
      const expenses = transactions.filter(t => t.type === "expense");
      
      if (expenses.length === 0) {
        setChartData([]);
        return;
      }

      const categoryTotals = expenses.reduce((acc, transaction) => {
        const category = transaction.category;
        acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
        return acc;
      }, {});

      const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount
      }));

      setChartData(chartData);
    } catch (err) {
      setError("Failed to load expense data");
    } finally {
      setLoading(false);
    }
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
          title="No expenses found"
          description="Add some expense transactions to see your spending breakdown"
        />
      </Card>
    );
  }

  const chartOptions = {
    chart: {
      type: "pie",
      height: 400,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800
      }
    },
    labels: chartData.map(item => item.category),
    colors: [
      "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4", "#64748b",
      "#10b981", "#3b82f6", "#f97316", "#ec4899", "#84cc16",
      "#6366f1", "#d946ef", "#0891b2", "#71717a"
    ],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
          height: 300
        },
        legend: {
          position: "bottom"
        }
      }
    }],
    legend: {
      position: "right",
      offsetY: 0,
      height: 400,
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "45%"
        },
        showLabels: true,
        dataLabels: {
          offset: -5
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        colors: ["#ffffff"]
      },
      background: {
        enabled: false
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.8
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return "$" + val.toFixed(2);
        }
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif"
      }
    }
  };

  const series = chartData.map(item => item.amount);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Expense Breakdown</h3>
        <p className="text-sm text-slate-600">Current month spending by category</p>
      </div>
      <div className="w-full">
        <Chart
          options={chartOptions}
          series={series}
          type="pie"
          height={400}
        />
      </div>
    </Card>
  );
};

export default ExpensePieChart;