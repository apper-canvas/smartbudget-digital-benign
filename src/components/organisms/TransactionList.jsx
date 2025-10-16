import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "react-toastify";

const TransactionList = ({ transactions, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (transaction) => {
    if (window.confirm(`Are you sure you want to delete this transaction?`)) {
      try {
        await onDelete(transaction.Id);
        toast.success("Transaction deleted successfully");
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Food & Dining": "#ef4444",
      "Transportation": "#f59e0b",
      "Shopping": "#8b5cf6",
      "Entertainment": "#06b6d4",
      "Bills & Utilities": "#64748b",
      "Health & Medical": "#10b981",
      "Travel": "#3b82f6",
      "Education": "#f97316",
      "Personal Care": "#ec4899",
      "Home & Garden": "#84cc16",
      "Insurance": "#6366f1",
      "Gifts & Donations": "#d946ef",
      "Business": "#0891b2",
      "Salary": "#10b981",
      "Freelance": "#059669",
      "Investment": "#047857",
      "Other Income": "#065f46",
      "Other Expenses": "#71717a"
    };
    return colors[category] || "#64748b";
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Receipt" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || selectedType !== "all" 
                  ? "Try adjusting your search filters" 
                  : "Add your first transaction to get started"}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.Id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${getCategoryColor(transaction.category)}, ${getCategoryColor(transaction.category)}dd)` }}
                  >
                    <ApperIcon 
                      name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                      className="w-5 h-5" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900">{transaction.description}</h4>
                      <Badge 
                        variant={transaction.type === "income" ? "success" : "default"}
                        style={{ 
                          backgroundColor: `${getCategoryColor(transaction.category)}20`,
                          color: getCategoryColor(transaction.category),
                          borderColor: `${getCategoryColor(transaction.category)}40`
                        }}
                      >
                        {transaction.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === "income" ? "text-success-600" : "text-slate-900"
                    }`}>
                      {transaction.type === "income" ? "+" : ""}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(transaction)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(transaction)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionList;