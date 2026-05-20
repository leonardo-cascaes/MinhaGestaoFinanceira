export interface Income {
  id: string;
  description: string;
  type: IncomeType;
  amount: number;
  /** Mês/ano de início da recorrência (ou do lançamento pontual) */
  month: number;
  year: number;
  /** Data de início da recorrência (dia do mês se repete nos meses seguintes) */
  date: Date;
  recurring: boolean;
  /** Último mês (inclusive) em que a receita recorrente vale, após encerramento */
  recurringEndMonth?: number;
  recurringEndYear?: number;
  /** Preenchido na projeção mensal — data original de início da recorrência */
  recurringStartDate?: Date;
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
