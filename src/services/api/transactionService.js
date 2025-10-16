import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getAll() {
    await delay(300);
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await delay(200);
    const transaction = transactions.find(t => t.Id === parseInt(id));
    return transaction ? { ...transaction } : null;
  },

  async create(transactionData) {
    await delay(400);
    const newId = Math.max(...transactions.map(t => t.Id)) + 1;
    const newTransaction = {
      Id: newId,
      ...transactionData,
      createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    return { ...newTransaction };
  },

  async update(id, transactionData) {
    await delay(350);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...transactionData };
    return { ...transactions[index] };
  },

  async delete(id) {
    await delay(250);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    transactions.splice(index, 1);
    return true;
  },

  async getByMonth(monthYear) {
    await delay(300);
    return transactions.filter(t => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
      return transactionMonth === monthYear;
    });
  },

  async getByCategory(category) {
    await delay(300);
    return transactions.filter(t => t.category === category);
  }
};