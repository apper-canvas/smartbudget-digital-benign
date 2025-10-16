import { getApperClient } from "@/services/apperClient";

export const budgetService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("budget_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "month_c" } },
          { field: { Name: "monthly_limit_c" } },
          { field: { Name: "year_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch budgets:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in budgetService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById("budget_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "month_c" } },
          { field: { Name: "monthly_limit_c" } },
          { field: { Name: "year_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch budget:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in budgetService.getById:", error);
      return null;
    }
  },

  async create(budgetData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Name: `Budget - ${budgetData.category_c || budgetData.category}`,
        category_c: budgetData.category_c || budgetData.category,
        month_c: budgetData.month_c || budgetData.month,
        monthly_limit_c: parseFloat(budgetData.monthly_limit_c || budgetData.monthlyLimit),
        year_c: parseInt(budgetData.year_c || budgetData.year)
      };

      const response = await apperClient.createRecord("budget_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to create budget:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Budget creation failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in budgetService.create:", error);
      throw error;
    }
  },

  async update(id, budgetData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Id: parseInt(id)
      };

      if (budgetData.category_c !== undefined || budgetData.category !== undefined) {
        record.category_c = budgetData.category_c || budgetData.category;
      }
      if (budgetData.month_c !== undefined || budgetData.month !== undefined) {
        record.month_c = budgetData.month_c || budgetData.month;
      }
      if (budgetData.monthly_limit_c !== undefined || budgetData.monthlyLimit !== undefined) {
        record.monthly_limit_c = parseFloat(budgetData.monthly_limit_c || budgetData.monthlyLimit);
      }
      if (budgetData.year_c !== undefined || budgetData.year !== undefined) {
        record.year_c = parseInt(budgetData.year_c || budgetData.year);
      }

      const response = await apperClient.updateRecord("budget_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to update budget:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Budget update failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in budgetService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("budget_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete budget:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error("Error in budgetService.delete:", error);
      return false;
    }
  },

  async getByMonth(monthYear) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("budget_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "month_c" } },
          { field: { Name: "monthly_limit_c" } },
          { field: { Name: "year_c" } }
        ],
        where: [
          {
            FieldName: "month_c",
            Operator: "EqualTo",
            Values: [monthYear]
          }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch budgets by month:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in budgetService.getByMonth:", error);
      return [];
    }
  },

  async upsertBudget(category, monthlyLimit, month, year) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      // Check if budget exists
      const existingResponse = await apperClient.fetchRecords("budget_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "month_c" } },
          { field: { Name: "monthly_limit_c" } },
          { field: { Name: "year_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          },
          {
            FieldName: "month_c",
            Operator: "EqualTo",
            Values: [month]
          },
          {
            FieldName: "year_c",
            Operator: "EqualTo",
            Values: [year]
          }
        ]
      });

      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing budget
        const existingBudget = existingResponse.data[0];
        return await this.update(existingBudget.Id, {
          monthly_limit_c: monthlyLimit
        });
      } else {
        // Create new budget
        return await this.create({
          category_c: category,
          monthly_limit_c: monthlyLimit,
          month_c: month,
          year_c: year
        });
      }
    } catch (error) {
      console.error("Error in budgetService.upsertBudget:", error);
      throw error;
    }
  }
};