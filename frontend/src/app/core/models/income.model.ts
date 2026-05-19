export interface Income {
  id: string;
  description: string;
  type: IncomeType;
  amount: number;
  month: number;
  year: number;
  date: Date;
  recurring: boolean;
  /** Último mês (inclusive) em que a receita recorrente vale, após encerramento */
  recurringEndMonth?: number;
  recurringEndYear?: number;
  notes?: string;
}

export enum IncomeType {
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  RENTAL = 'rental',
  BONUS = 'bonus',
  OTHER = 'other',
}
