import React, { useState, useEffect } from "react";
import TransactionForm from "@/components/organisms/TransactionForm";
import TransactionList from "@/components/organisms/TransactionList";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

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
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      await transactionService.create(transactionData);
      toast.success("Transaction added successfully");
      setShowForm(false);
      await loadTransactions();
    } catch (error) {
      throw new Error("Failed to add transaction");
    }
  };

  const handleEditTransaction = async (transactionData) => {
    try {
      await transactionService.update(editingTransaction.Id, transactionData);
      toast.success("Transaction updated successfully");
      setEditingTransaction(null);
      await loadTransactions();
    } catch (error) {
      throw new Error("Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await transactionService.delete(transactionId);
      await loadTransactions();
    } catch (error) {
      throw new Error("Failed to delete transaction");
    }
  };

  const startEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTransactions} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Transactions
          </h1>
          <p className="text-slate-600">Track your income and expenses</p>
        </div>
        <Button onClick={() => {
          setShowForm(!showForm);
          setEditingTransaction(null);
        }}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add Transaction"}
        </Button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Transaction Form */}
      {editingTransaction && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Edit Transaction</h2>
            <Button variant="secondary" onClick={cancelEdit}>
              <ApperIcon name="X" className="w-4 h-4 mr-2" />
              Cancel Edit
            </Button>
          </div>
          <TransactionForm
            onSubmit={handleEditTransaction}
            onCancel={cancelEdit}
            initialData={editingTransaction}
            isEditing={true}
          />
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
          <div className="text-sm text-slate-600">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} total
          </div>
        </div>
        
        <TransactionList
          transactions={transactions}
          onEdit={startEdit}
          onDelete={handleDeleteTransaction}
          loading={false}
        />
      </div>
    </div>
  );
};

export default Transactions;