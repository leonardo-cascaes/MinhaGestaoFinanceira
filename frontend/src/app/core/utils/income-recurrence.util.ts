import { Income } from '@core/models/income.model';

function toAbsoluteMonth(month: number, year: number): number {
  return year * 12 + month;
}

export function isRecurringTemplate(income: Income): boolean {
  return income.recurring || hasRecurrenceEnded(income);
}

export function hasRecurrenceEnded(income: Income): boolean {
  return income.recurringEndMonth != null && income.recurringEndYear != null;
}

export function isRecurringActive(income: Income): boolean {
  return income.recurring && !hasRecurrenceEnded(income);
}

export function getRecurrenceStartDate(income: Income): Date {
  const anchor = income.recurringStartDate ?? income.date;
  return anchor instanceof Date ? anchor : new Date(anchor);
}

export function getRecurrenceDayOfMonth(income: Income): number {
  return getRecurrenceStartDate(income).getDate();
}

export function isIncomeVisibleInMonth(
  income: Income,
  month: number,
  year: number,
): boolean {
  const target = toAbsoluteMonth(month, year);
  const start = toAbsoluteMonth(income.month, income.year);

  if (target < start) return false;

  if (!isRecurringTemplate(income)) {
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
  if (!isRecurringTemplate(income)) {
    return income;
  }

  const startDate = getRecurrenceStartDate(income);
  const day = startDate.getDate();
  const lastDay = new Date(year, month, 0).getDate();
  const paymentDate = new Date(year, month - 1, Math.min(day, lastDay));

  return {
    ...income,
    month,
    year,
    date: paymentDate,
    recurringStartDate: startDate,
  };
}
