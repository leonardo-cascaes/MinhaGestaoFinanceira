export interface MonthlyBalance {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  /** Soma dos saldos mensais (com movimentação) desde o início até este mês */
  accumulatedBalance: number;
}
