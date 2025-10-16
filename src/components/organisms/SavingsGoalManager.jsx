import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import ProgressCard from "@/components/molecules/ProgressCard";
import ApperIcon from "@/components/ApperIcon";
import { savingsGoalService } from "@/services/api/savingsGoalService";
import { formatCurrency, formatDate, formatDateInput } from "@/utils/formatters";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const SavingsGoalManager = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: formatDateInput(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await savingsGoalService.getAll();
      setGoals(data);
    } catch (err) {
      setError("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(formData.targetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }

    try {
      const goalData = {
        ...formData,
        targetAmount: amount,
        currentAmount: 0,
        deadline: new Date(formData.deadline).toISOString()
      };

      await savingsGoalService.create(goalData);
      toast.success("Savings goal created successfully");
      setFormData({
        title: "",
        targetAmount: "",
        deadline: formatDateInput(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
      });
      setShowForm(false);
      await loadGoals();
    } catch (error) {
      toast.error("Failed to create savings goal");
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    
    if (!selectedGoal || !contributeAmount) {
      toast.error("Please enter a contribution amount");
      return;
    }

    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await savingsGoalService.updateAmount(selectedGoal.Id, amount);
      toast.success("Contribution added successfully");
      setContributeAmount("");
      setShowContributeModal(false);
      setSelectedGoal(null);
      await loadGoals();
    } catch (error) {
      toast.error("Failed to add contribution");
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this savings goal?")) {
      try {
        await savingsGoalService.delete(goalId);
        toast.success("Savings goal deleted successfully");
        await loadGoals();
      } catch (error) {
        toast.error("Failed to delete savings goal");
      }
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGoals} />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Savings Goals</h2>
            <p className="text-slate-600">Track progress towards your financial objectives</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "Add Goal"}
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Goal Title">
                <Input
                  placeholder="e.g., Emergency Fund, Vacation, New Car..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </FormField>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Target Amount">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  />
                </FormField>

                <FormField label="Target Date">
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </FormField>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Create Goal</Button>
              </div>
            </form>
          </div>
        )}
      </Card>

      {goals.length === 0 ? (
        <Empty
          title="No savings goals yet"
          description="Create your first savings goal to start tracking your progress"
          action={
            <Button onClick={() => setShowForm(true)}>
              <ApperIcon name="Target" className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isOverdue = daysRemaining < 0;

            return (
              <Card key={goal.Id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{goal.title}</h3>
                      <p className="text-sm text-slate-600">
                        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Target: {formatDate(goal.deadline)}
                        {isOverdue ? (
                          <span className="text-error-600 font-medium ml-1">(Overdue)</span>
                        ) : daysRemaining <= 30 ? (
                          <span className="text-warning-600 font-medium ml-1">({daysRemaining} days left)</span>
                        ) : (
                          <span className="text-slate-600 ml-1">({daysRemaining} days left)</span>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowContributeModal(true);
                        }}
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(goal.Id)}
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        {percentage.toFixed(0)}% Complete
                      </span>
                      <span className="text-sm text-slate-600">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 100
                            ? "bg-gradient-to-r from-success-500 to-success-600"
                            : isOverdue
                            ? "bg-gradient-to-r from-error-500 to-error-600"
                            : "bg-gradient-to-r from-primary-500 to-primary-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {percentage >= 100 && (
                    <div className="flex items-center p-3 bg-success-50 border border-success-200 rounded-lg">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-success-600 mr-2" />
                      <p className="text-sm text-success-800 font-medium">Goal achieved! 🎉</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Contribution Modal */}
      {showContributeModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add Contribution</h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setShowContributeModal(false);
                  setSelectedGoal(null);
                  setContributeAmount("");
                }}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Contributing to: <strong>{selectedGoal.title}</strong></p>
                <p className="text-sm text-slate-500">
                  Current: {formatCurrency(selectedGoal.currentAmount)} / {formatCurrency(selectedGoal.targetAmount)}
                </p>
              </div>
              
              <FormField label="Contribution Amount">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  autoFocus
                />
              </FormField>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowContributeModal(false);
                    setSelectedGoal(null);
                    setContributeAmount("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Contribution</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalManager;