import savingsGoalsData from "@/services/mockData/savingsGoals.json";

let savingsGoals = [...savingsGoalsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const savingsGoalService = {
  async getAll() {
    await delay(300);
    return [...savingsGoals].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  },

  async getById(id) {
    await delay(200);
    const goal = savingsGoals.find(g => g.Id === parseInt(id));
    return goal ? { ...goal } : null;
  },

  async create(goalData) {
    await delay(400);
    const newId = Math.max(...savingsGoals.map(g => g.Id)) + 1;
    const newGoal = {
      Id: newId,
      ...goalData,
      createdAt: new Date().toISOString()
    };
    savingsGoals.push(newGoal);
    return { ...newGoal };
  },

  async update(id, goalData) {
    await delay(350);
    const index = savingsGoals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) return null;
    
    savingsGoals[index] = { ...savingsGoals[index], ...goalData };
    return { ...savingsGoals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = savingsGoals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) return false;
    
    savingsGoals.splice(index, 1);
    return true;
  },

  async updateAmount(id, amount) {
    await delay(350);
    const index = savingsGoals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) return null;
    
    savingsGoals[index].currentAmount = Math.max(0, savingsGoals[index].currentAmount + amount);
    return { ...savingsGoals[index] };
  }
};