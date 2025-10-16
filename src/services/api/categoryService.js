import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("category_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "is_custom_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch categories:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in categoryService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById("category_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "is_custom_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch category:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in categoryService.getById:", error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Name: categoryData.name_c || categoryData.name,
        name_c: categoryData.name_c || categoryData.name,
        type_c: categoryData.type_c || categoryData.type,
        color_c: categoryData.color_c || categoryData.color,
        is_custom_c: true
      };

      const response = await apperClient.createRecord("category_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to create category:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Category creation failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in categoryService.create:", error);
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const record = {
        Id: parseInt(id)
      };

      if (categoryData.name_c !== undefined || categoryData.name !== undefined) {
        record.name_c = categoryData.name_c || categoryData.name;
        record.Name = record.name_c;
      }
      if (categoryData.type_c !== undefined || categoryData.type !== undefined) {
        record.type_c = categoryData.type_c || categoryData.type;
      }
      if (categoryData.color_c !== undefined || categoryData.color !== undefined) {
        record.color_c = categoryData.color_c || categoryData.color;
      }

      const response = await apperClient.updateRecord("category_c", {
        records: [record]
      });

      if (!response.success) {
        console.error("Failed to update category:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          console.error("Category update failed:", result.message);
          throw new Error(result.message);
        }
        return result.data;
      }

      return null;
    } catch (error) {
      console.error("Error in categoryService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const category = await this.getById(id);
      if (!category || !category.is_custom_c) return false;

      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("category_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete category:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error("Error in categoryService.delete:", error);
      return false;
    }
  },

  async getByType(type) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("category_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "is_custom_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch categories by type:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
console.error("Error in categoryService.getByType:", error);
      return [];
    }
  }
};