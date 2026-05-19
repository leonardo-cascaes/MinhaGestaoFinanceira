export interface Expense {
  id: string;
  description: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  month: number;
  year: number;
  date: Date;
  paymentMethod: PaymentMethod;
  notes?: string;
  subscription?: SubscriptionInfo;
  installment?: InstallmentInfo;
}

export enum ExpenseType {
  SINGLE = 'single',
  SUBSCRIPTION = 'subscription',
  INSTALLMENT = 'installment',
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  HOUSING = 'housing',
  HEALTH = 'health',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  SUBSCRIPTION = 'subscription',
  SHOPPING = 'shopping',
  OTHER = 'other',
}

export enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  TRANSFER = 'transfer',
}

export interface SubscriptionInfo {
  isFixed: boolean;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  cancelledAt?: Date;
  isActive: boolean;
}

export interface InstallmentInfo {
  totalInstallments: number;
  currentInstallment: number;
  installmentAmount: number;
  totalAmount: number;
  startMonth: number;
  startYear: number;
  paymentMethod: PaymentMethod;
  /** @deprecated Prefer advancePayments */
  advancePayment?: AdvancePaymentInfo;
  advancePayments?: AdvancePaymentInfo[];
}

export interface AdvancePaymentInfo {
  installmentsAdvanced: number;
  amountPaid: number;
  originalAmount: number;
  discount: number;
  date: Date;
}
