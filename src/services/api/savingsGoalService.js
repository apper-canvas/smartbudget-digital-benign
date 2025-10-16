import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

export const savingsGoalService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("savings_goal_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [{ fieldName: "deadline_c", sorttype: "ASC" }]
      });

      if (!response.success) {
        console.error("Failed to fetch savings goals:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in savingsGoalService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById("savings_goal_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "created_at_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch savings goal:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in savingsGoalService.getById:", error);
      return null;
    }
  },

  async create(goalData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Name: goalData.title_c || goalData.title,
        title_c: goalData.title_c || goalData.title,
        target_amount_c: parseFloat(goalData.target_amount_c || goalData.targetAmount),
        current_amount_c: parseFloat(goalData.current_amount_c || goalData.currentAmount || 0),
        deadline_c: new Date(goalData.deadline_c || goalData.deadline).toISOString(),
        created_at_c: new Date().toISOString()
      };

      const response = await apperClient.createRecord("savings_goal_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to create savings goal:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Savings goal creation failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in savingsGoalService.create:", error);
      throw error;
    }
  },

  async update(id, goalData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Id: parseInt(id)
      };

      if (goalData.title_c !== undefined || goalData.title !== undefined) {
        record.title_c = goalData.title_c || goalData.title;
        record.Name = record.title_c;
      }
      if (goalData.target_amount_c !== undefined || goalData.targetAmount !== undefined) {
        record.target_amount_c = parseFloat(goalData.target_amount_c || goalData.targetAmount);
      }
      if (goalData.current_amount_c !== undefined || goalData.currentAmount !== undefined) {
        record.current_amount_c = parseFloat(goalData.current_amount_c || goalData.currentAmount);
      }
      if (goalData.deadline_c !== undefined || goalData.deadline !== undefined) {
        record.deadline_c = new Date(goalData.deadline_c || goalData.deadline).toISOString();
      }

      const response = await apperClient.updateRecord("savings_goal_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to update savings goal:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Savings goal update failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in savingsGoalService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("savings_goal_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete savings goal:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error("Error in savingsGoalService.delete:", error);
      return false;
    }
  },

  async updateAmount(id, amount) {
    try {
      const goal = await this.getById(id);
      if (!goal) return null;

      const newAmount = Math.max(0, (goal.current_amount_c || 0) + amount);
      return await this.update(id, {
        current_amount_c: newAmount
      });
    } catch (error) {
      console.error("Error in savingsGoalService.updateAmount:", error);
return null;
    }
  }
};