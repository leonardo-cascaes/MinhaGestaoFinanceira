import { Income, IncomeType } from '@core/models/income.model';
import {
  Expense,
  ExpenseType,
  ExpenseCategory,
  PaymentMethod,
} from '@core/models/expense.model';

function id(): string {
  return crypto.randomUUID();
}

// ─── Receitas (Janeiro a Junho 2026) ─────────────────────────────────

export const FAKE_INCOMES: Income[] = [
  // Salário mensal recorrente — R$ 8.500 (desde jan/2026)
  {
    id: id(),
    description: 'Salário',
    type: IncomeType.SALARY,
    amount: 8500,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 5),
    recurring: true,
  },

  // Rendimento de investimento recorrente — R$ 350/mês (desde jan/2026)
  {
    id: id(),
    description: 'Rendimento CDB',
    type: IncomeType.INVESTMENT,
    amount: 350,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 2),
    recurring: true,
  },

  // Freelances pontuais
  {
    id: id(),
    description: 'Freelance - Landing Page',
    type: IncomeType.FREELANCE,
    amount: 2500,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 18),
    recurring: false,
  },
  {
    id: id(),
    description: 'Freelance - Identidade Visual',
    type: IncomeType.FREELANCE,
    amount: 1800,
    month: 3,
    year: 2026,
    date: new Date(2026, 2, 10),
    recurring: false,
  },
  {
    id: id(),
    description: 'Freelance - Automação',
    type: IncomeType.FREELANCE,
    amount: 1200,
    month: 5,
    year: 2026,
    date: new Date(2026, 4, 22),
    recurring: false,
  },
];

// ─── Despesas ────────────────────────────────────────────────────────

export const FAKE_EXPENSES: Expense[] = [
  // ── Assinaturas fixas ──────────────────────────────────────────────

  {
    id: id(),
    description: 'Aluguel',
    type: ExpenseType.SUBSCRIPTION,
    category: ExpenseCategory.HOUSING,
    amount: 2200,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 1),
    paymentMethod: PaymentMethod.TRANSFER,
    subscription: {
      isFixed: true,
      startMonth: 1,
      startYear: 2025,
      isActive: true,
    },
  },
  {
    id: id(),
    description: 'Internet Fibra',
    type: ExpenseType.SUBSCRIPTION,
    category: ExpenseCategory.SUBSCRIPTION,
    amount: 120,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 10),
    paymentMethod: PaymentMethod.DEBIT_CARD,
    subscription: {
      isFixed: true,
      startMonth: 6,
      startYear: 2024,
      isActive: true,
    },
  },
  {
    id: id(),
    description: 'Streaming (Netflix)',
    type: ExpenseType.SUBSCRIPTION,
    category: ExpenseCategory.ENTERTAINMENT,
    amount: 55.9,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 15),
    paymentMethod: PaymentMethod.CREDIT_CARD,
    subscription: {
      isFixed: true,
      startMonth: 3,
      startYear: 2024,
      isActive: true,
    },
  },
  {
    id: id(),
    description: 'Academia SmartFit',
    type: ExpenseType.SUBSCRIPTION,
    category: ExpenseCategory.HEALTH,
    amount: 99.9,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 5),
    paymentMethod: PaymentMethod.CREDIT_CARD,
    subscription: {
      isFixed: true,
      startMonth: 8,
      startYear: 2025,
      isActive: true,
    },
  },

  // ── Assinatura cancelada (Spotify) ─────────────────────────────────
  {
    id: id(),
    description: 'Spotify Premium',
    type: ExpenseType.SUBSCRIPTION,
    category: ExpenseCategory.ENTERTAINMENT,
    amount: 34.9,
    month: 1,
    year: 2026,
    date: new Date(2025, 5, 1),
    paymentMethod: PaymentMethod.CREDIT_CARD,
    subscription: {
      isFixed: true,
      startMonth: 6,
      startYear: 2025,
      cancelledAt: new Date(2026, 2, 15), // cancelado em março/2026
      isActive: false,
    },
  },

  // ── Parcelamento: Notebook 12x ─────────────────────────────────────
  {
    id: id(),
    description: 'Notebook Dell Inspiron',
    type: ExpenseType.INSTALLMENT,
    category: ExpenseCategory.SHOPPING,
    amount: 400,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 8),
    paymentMethod: PaymentMethod.CREDIT_CARD,
    installment: {
      totalInstallments: 12,
      currentInstallment: 1,
      installmentAmount: 400,
      totalAmount: 4800,
      startMonth: 1,
      startYear: 2026,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    },
  },

  // ── Parcelamento: Celular 10x (com adiantamento) ───────────────────
  {
    id: id(),
    description: 'Celular Samsung Galaxy S25',
    type: ExpenseType.INSTALLMENT,
    category: ExpenseCategory.SHOPPING,
    amount: 300,
    month: 11,
    year: 2025,
    date: new Date(2025, 10, 5),
    paymentMethod: PaymentMethod.CREDIT_CARD,
    installment: {
      totalInstallments: 10,
      currentInstallment: 1,
      installmentAmount: 300,
      totalAmount: 3000,
      startMonth: 11,
      startYear: 2025,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      advancePayment: {
        installmentsAdvanced: 3,
        amountPaid: 750,
        originalAmount: 900,
        discount: 150,
        date: new Date(2026, 3, 10), // adiantamento feito em abril/2026
      },
    },
  },

  // ── Despesas avulsas variadas (Jan–Jun 2026) ───────────────────────

  // Janeiro
  {
    id: id(),
    description: 'Supermercado Extra',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 985.4,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 12),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },
  {
    id: id(),
    description: 'Uber / Transporte',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.TRANSPORT,
    amount: 142.5,
    month: 1,
    year: 2026,
    date: new Date(2026, 0, 20),
    paymentMethod: PaymentMethod.PIX,
  },

  // Fevereiro
  {
    id: id(),
    description: 'Supermercado Pão de Açúcar',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 1120.3,
    month: 2,
    year: 2026,
    date: new Date(2026, 1, 8),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },
  {
    id: id(),
    description: 'Farmácia',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.HEALTH,
    amount: 187.6,
    month: 2,
    year: 2026,
    date: new Date(2026, 1, 14),
    paymentMethod: PaymentMethod.PIX,
  },
  {
    id: id(),
    description: 'Combustível',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.TRANSPORT,
    amount: 250,
    month: 2,
    year: 2026,
    date: new Date(2026, 1, 22),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },

  // Março
  {
    id: id(),
    description: 'Supermercado Atacadão',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 890.75,
    month: 3,
    year: 2026,
    date: new Date(2026, 2, 5),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },
  {
    id: id(),
    description: 'Curso Udemy',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.EDUCATION,
    amount: 27.9,
    month: 3,
    year: 2026,
    date: new Date(2026, 2, 12),
    paymentMethod: PaymentMethod.PIX,
  },
  {
    id: id(),
    description: 'Jantar restaurante',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 185.0,
    month: 3,
    year: 2026,
    date: new Date(2026, 2, 21),
    paymentMethod: PaymentMethod.CREDIT_CARD,
  },

  // Abril
  {
    id: id(),
    description: 'Supermercado Extra',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 1050.2,
    month: 4,
    year: 2026,
    date: new Date(2026, 3, 7),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },
  {
    id: id(),
    description: 'Consulta médica',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.HEALTH,
    amount: 350,
    month: 4,
    year: 2026,
    date: new Date(2026, 3, 15),
    paymentMethod: PaymentMethod.PIX,
  },
  {
    id: id(),
    description: 'Uber / Transporte',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.TRANSPORT,
    amount: 98.0,
    month: 4,
    year: 2026,
    date: new Date(2026, 3, 25),
    paymentMethod: PaymentMethod.PIX,
  },

  // Maio
  {
    id: id(),
    description: 'Supermercado Pão de Açúcar',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 930.6,
    month: 5,
    year: 2026,
    date: new Date(2026, 4, 10),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },
  {
    id: id(),
    description: 'Presente Dia das Mães',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.SHOPPING,
    amount: 280,
    month: 5,
    year: 2026,
    date: new Date(2026, 4, 8),
    paymentMethod: PaymentMethod.PIX,
  },

  // Junho
  {
    id: id(),
    description: 'Supermercado Atacadão',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.FOOD,
    amount: 1180.9,
    month: 6,
    year: 2026,
    date: new Date(2026, 5, 6),
    paymentMethod: PaymentMethod.DEBIT_CARD,
  },
  {
    id: id(),
    description: 'Manutenção carro',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.TRANSPORT,
    amount: 650,
    month: 6,
    year: 2026,
    date: new Date(2026, 5, 18),
    paymentMethod: PaymentMethod.PIX,
  },
  {
    id: id(),
    description: 'Festa junina',
    type: ExpenseType.SINGLE,
    category: ExpenseCategory.ENTERTAINMENT,
    amount: 120,
    month: 6,
    year: 2026,
    date: new Date(2026, 5, 24),
    paymentMethod: PaymentMethod.CASH,
  },
];
