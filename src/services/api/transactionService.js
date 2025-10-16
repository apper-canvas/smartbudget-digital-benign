import { getApperClient } from "@/services/apperClient";
export const transactionService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      });

      if (!response.success) {
        console.error("Failed to fetch transactions:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in transactionService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById("transaction_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch transaction:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in transactionService.getById:", error);
      return null;
    }
  },

  async create(transactionData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Name: transactionData.description_c || transactionData.description || "Transaction",
        amount_c: parseFloat(transactionData.amount_c || transactionData.amount),
        category_c: transactionData.category_c || transactionData.category,
        date_c: new Date(transactionData.date_c || transactionData.date).toISOString(),
        description_c: transactionData.description_c || transactionData.description,
        type_c: transactionData.type_c || transactionData.type
      };

      const response = await apperClient.createRecord("transaction_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to create transaction:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Transaction creation failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in transactionService.create:", error);
      throw error;
    }
  },

  async update(id, transactionData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Id: parseInt(id)
      };

      if (transactionData.amount_c !== undefined || transactionData.amount !== undefined) {
        record.amount_c = parseFloat(transactionData.amount_c || transactionData.amount);
      }
      if (transactionData.category_c !== undefined || transactionData.category !== undefined) {
        record.category_c = transactionData.category_c || transactionData.category;
      }
      if (transactionData.date_c !== undefined || transactionData.date !== undefined) {
        record.date_c = new Date(transactionData.date_c || transactionData.date).toISOString();
      }
      if (transactionData.description_c !== undefined || transactionData.description !== undefined) {
        record.description_c = transactionData.description_c || transactionData.description;
        record.Name = record.description_c;
      }
      if (transactionData.type_c !== undefined || transactionData.type !== undefined) {
        record.type_c = transactionData.type_c || transactionData.type;
      }

      const response = await apperClient.updateRecord("transaction_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to update transaction:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Transaction update failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in transactionService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("transaction_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete transaction:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error("Error in transactionService.delete:", error);
      return false;
    }
  },

  async getByMonth(monthYear) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "Contains",
            Values: [monthYear]
          }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch transactions by month:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in transactionService.getByMonth:", error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch transactions by category:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in transactionService.getByCategory:", error);
return [];
    }
  }
};