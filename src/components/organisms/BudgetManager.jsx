import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { budgetService } from "@/services/api/budgetService";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { getCurrentMonth, formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    monthlyLimit: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const currentMonth = getCurrentMonth();
      const [budgetsData, categoriesData, transactionsData] = await Promise.all([
        budgetService.getByMonth(currentMonth),
        categoryService.getByType("expense"),
        transactionService.getByMonth(currentMonth)
      ]);
      
      setBudgets(budgetsData);
      setCategories(categoriesData);
      setTransactions(transactionsData.filter(t => t.type === "expense"));
    } catch (err) {
      setError("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.monthlyLimit) {
      toast.error("Please fill in all fields");
      return;
    }

    const limit = parseFloat(formData.monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      toast.error("Please enter a valid budget limit");
      return;
    }

    try {
      const currentMonth = getCurrentMonth();
      const [year, month] = currentMonth.split("-");
      
      await budgetService.upsertBudget(
        formData.category,
        limit,
        currentMonth,
        parseInt(year)
      );
      
      toast.success("Budget saved successfully");
      setFormData({ category: "", monthlyLimit: "" });
      setShowForm(false);
      await loadData();
    } catch (error) {
      toast.error("Failed to save budget");
    }
  };

  const getSpentAmount = (category) => {
    return transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getProgressPercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "error";
    if (percentage >= 75) return "warning";
    return "success";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Budget Management</h2>
            <p className="text-slate-600">Set and track spending limits by category</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "Add Budget"}
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Category">
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select category...</option>
                    {categories
                      .filter(cat => !budgets.find(b => b.category === cat.name))
                      .map(category => (
                        <option key={category.Id} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    }
                  </Select>
                </FormField>

                <FormField label="Monthly Limit">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.monthlyLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                  />
                </FormField>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Budget</Button>
              </div>
            </form>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.length === 0 ? (
          <Card className="p-8 col-span-2">
            <div className="text-center">
              <ApperIcon name="PieChart" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No budgets set</h3>
              <p className="text-slate-600 mb-4">
                Create your first budget to start tracking your spending limits
              </p>
              <Button onClick={() => setShowForm(true)}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Your First Budget
              </Button>
            </div>
          </Card>
        ) : (
          budgets.map((budget) => {
            const spent = getSpentAmount(budget.category);
            const percentage = getProgressPercentage(spent, budget.monthlyLimit);
            const remaining = Math.max(0, budget.monthlyLimit - spent);
            const color = getProgressColor(percentage);

            return (
              <Card key={budget.Id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{budget.category}</h3>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        {formatCurrency(spent)} of {formatCurrency(budget.monthlyLimit)}
                      </p>
                      <p className={`text-sm font-medium ${
                        remaining > 0 ? "text-success-600" : "text-error-600"
                      }`}>
                        {formatCurrency(remaining)} remaining
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        {percentage.toFixed(0)}% Used
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          color === "success" 
                            ? "bg-gradient-to-r from-success-500 to-success-600"
                            : color === "warning"
                            ? "bg-gradient-to-r from-warning-500 to-warning-600"
                            : "bg-gradient-to-r from-error-500 to-error-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {percentage >= 90 && (
                    <div className="flex items-center p-3 bg-error-50 border border-error-200 rounded-lg">
                      <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error-600 mr-2" />
                      <p className="text-sm text-error-800">
                        {percentage >= 100 ? "Budget exceeded!" : "Close to budget limit"}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetManager;