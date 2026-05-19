import { Income } from '@core/models/income.model';

function toAbsoluteMonth(month: number, year: number): number {
  return year * 12 + month;
}

export function hasRecurrenceEnded(income: Income): boolean {
  return income.recurringEndMonth != null && income.recurringEndYear != null;
}

export function isRecurringActive(income: Income): boolean {
  return income.recurring && !hasRecurrenceEnded(income);
}

export function isIncomeVisibleInMonth(
  income: Income,
  month: number,
  year: number,
): boolean {
  const target = toAbsoluteMonth(month, year);
  const start = toAbsoluteMonth(income.month, income.year);

  if (target < start) return false;

  const isRecurringTemplate =
    income.recurring || hasRecurrenceEnded(income);

  if (!isRecurringTemplate) {
    return income.month === month && income.year === year;
  }

  if (hasRecurrenceEnded(income)) {
    const end = toAbsoluteMonth(
      income.recurringEndMonth!,
      income.recurringEndYear!,
    );
    return target <= end;
  }

  return true;
}

export function projectIncomeForMonth(
  income: Income,
  month: number,
  year: number,
): Income {
  if (income.month === month && income.year === year) {
    return income;
  }

  const source = income.date instanceof Date ? income.date : new Date(income.date);
  const day = source.getDate();
  const lastDay = new Date(year, month, 0).getDate();

  return {
    ...income,
    month,
    year,
    date: new Date(year, month - 1, Math.min(day, lastDay)),
  };
}
