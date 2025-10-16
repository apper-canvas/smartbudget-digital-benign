import budgetsData from "@/services/mockData/budgets.json";

let budgets = [...budgetsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetService = {
  async getAll() {
    await delay(300);
    return [...budgets];
  },

  async getById(id) {
    await delay(200);
    const budget = budgets.find(b => b.Id === parseInt(id));
    return budget ? { ...budget } : null;
  },

  async create(budgetData) {
    await delay(400);
    const newId = Math.max(...budgets.map(b => b.Id)) + 1;
    const newBudget = {
      Id: newId,
      ...budgetData
    };
    budgets.push(newBudget);
    return { ...newBudget };
  },

  async update(id, budgetData) {
    await delay(350);
    const index = budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) return null;
    
    budgets[index] = { ...budgets[index], ...budgetData };
    return { ...budgets[index] };
  },

  async delete(id) {
    await delay(250);
    const index = budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) return false;
    
    budgets.splice(index, 1);
    return true;
  },

  async getByMonth(monthYear) {
    await delay(300);
    return budgets.filter(b => b.month === monthYear);
  },

  async upsertBudget(category, monthlyLimit, month, year) {
    await delay(350);
    const existingIndex = budgets.findIndex(b => 
      b.category === category && b.month === month && b.year === year
    );

    if (existingIndex !== -1) {
      budgets[existingIndex].monthlyLimit = monthlyLimit;
      return { ...budgets[existingIndex] };
    } else {
      const newId = Math.max(...budgets.map(b => b.Id)) + 1;
      const newBudget = {
        Id: newId,
        category,
        monthlyLimit,
        month,
        year
      };
      budgets.push(newBudget);
      return { ...newBudget };
    }
  }
};