import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import { categoryService } from "@/services/api/categoryService";
import { formatDateInput } from "@/utils/formatters";
import { toast } from "react-toastify";

const TransactionForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense",
    description: "",
    date: formatDateInput(new Date())
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: Math.abs(initialData.amount).toString(),
        category: initialData.category,
        type: initialData.type,
        description: initialData.description,
        date: formatDateInput(initialData.date)
      });
    }
  }, [initialData]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: formData.type === "expense" ? -Math.abs(amount) : Math.abs(amount),
        date: new Date(formData.date).toISOString()
      };

      await onSubmit(transactionData);
      
      if (!isEditing) {
        setFormData({
          amount: "",
          category: "",
          type: "expense",
          description: "",
          date: formatDateInput(new Date())
        });
      }
    } catch (error) {
      toast.error("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const expenseCategories = categories.filter(c => c.type === "expense");
  const incomeCategories = categories.filter(c => c.type === "income");

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Type">
            <Select
              value={formData.type}
              onChange={(e) => {
                handleChange("type", e.target.value);
                handleChange("category", "");
              }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </FormField>

          <FormField label="Amount *">
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category *">
            <Select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select category...</option>
              {formData.type === "expense" && 
                expenseCategories.map(category => (
                  <option key={category.Id} value={category.name}>
                    {category.name}
                  </option>
                ))
              }
              {formData.type === "income" && 
                incomeCategories.map(category => (
                  <option key={category.Id} value={category.name}>
                    {category.name}
                  </option>
                ))
              }
            </Select>
          </FormField>

          <FormField label="Date *">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Description *">
          <Input
            placeholder="Enter transaction description..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Transaction" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TransactionForm;