import { Income } from '@core/models/income.model';
import { Expense } from '@core/models/expense.model';

export function toAbsoluteMonth(month: number, year: number): number {
  return year * 12 + month;
}

export function fromAbsoluteMonth(absolute: number): { month: number; year: number } {
  return {
    month: ((absolute - 1) % 12) + 1,
    year: Math.floor((absolute - 1) / 12),
  };
}

export function listMonthsInclusive(
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number,
): { month: number; year: number }[] {
  const start = toAbsoluteMonth(startMonth, startYear);
  const end = toAbsoluteMonth(endMonth, endYear);
  const periods: { month: number; year: number }[] = [];

  for (let abs = start; abs <= end; abs++) {
    periods.push(fromAbsoluteMonth(abs));
  }

  return periods;
}

export function resolveEarliestActivityPeriod(
  incomes: Income[],
  expenses: Expense[],
  upToMonth: number,
  upToYear: number,
): { month: number; year: number } | null {
  const upTo = toAbsoluteMonth(upToMonth, upToYear);
  let earliest = upTo;

  for (const income of incomes) {
    earliest = Math.min(earliest, toAbsoluteMonth(income.month, income.year));
  }

  for (const expense of expenses) {
    let month = expense.month;
    let year = expense.year;
    if (expense.subscription) {
      month = expense.subscription.startMonth;
      year = expense.subscription.startYear;
    } else if (expense.installment) {
      month = expense.installment.startMonth;
      year = expense.installment.startYear;
    }
    earliest = Math.min(earliest, toAbsoluteMonth(month, year));
  }

  if (earliest > upTo) {
    return null;
  }

  return fromAbsoluteMonth(earliest);
}

export function listLastNMonths(
  endMonth: number,
  endYear: number,
  count: number,
): { month: number; year: number }[] {
  const periods: { month: number; year: number }[] = [];
  let m = endMonth;
  let y = endYear;

  for (let i = 0; i < count; i++) {
    periods.unshift({ month: m, year: y });
    m--;
    if (m === 0) {
      m = 12;
      y--;
    }
  }

  return periods;
}
