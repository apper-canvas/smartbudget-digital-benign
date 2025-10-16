import categoriesData from "@/services/mockData/categories.json";

let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay(300);
    const newId = Math.max(...categories.map(c => c.Id)) + 1;
    const newCategory = {
      Id: newId,
      ...categoryData,
      isCustom: true
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(250);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    categories[index] = { ...categories[index], ...categoryData };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1 || !categories[index].isCustom) return false;
    
    categories.splice(index, 1);
    return true;
  },

  async getByType(type) {
    await delay(200);
    return categories.filter(c => c.type === type);
  }
};