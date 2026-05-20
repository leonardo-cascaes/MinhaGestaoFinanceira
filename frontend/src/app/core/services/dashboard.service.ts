import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MonthlyBalance } from '@core/models/balance.model';
import { ExpenseCategory } from '@core/models/expense.model';
import { BalanceService } from './balance.service';
import { ExpenseService } from './expense.service';
import { MonthContextService } from './month-context.service';
import { sanitizeChartNumber } from '@core/utils/chart-format.util';

export interface ChartGroupedData {
  name: string;
  series: { name: string; value: number }[];
}

export interface ChartSingleData {
  name: string;
  value: number;
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: 'Alimentação',
  [ExpenseCategory.TRANSPORT]: 'Transporte',
  [ExpenseCategory.HOUSING]: 'Moradia',
  [ExpenseCategory.HEALTH]: 'Saúde',
  [ExpenseCategory.EDUCATION]: 'Educação',
  [ExpenseCategory.ENTERTAINMENT]: 'Lazer',
  [ExpenseCategory.SUBSCRIPTION]: 'Assinaturas',
  [ExpenseCategory.SHOPPING]: 'Compras',
  [ExpenseCategory.OTHER]: 'Outros',
};

const MONTH_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly expenseService: ExpenseService,
    private readonly monthContext: MonthContextService,
  ) {}

  getCurrentBalance(): Observable<MonthlyBalance> {
    return this.monthContext.currentMonth$.pipe(
      switchMap(({ month, year }) =>
        this.balanceService.getMonthlyBalance(month, year),
      ),
    );
  }

  getIncomeVsExpenseData(): Observable<ChartGroupedData[]> {
    return this.monthContext.currentMonth$.pipe(
      switchMap(({ month, year }) => {
        const periods = this.getLast6Months(month, year);
        return this.balanceService.getBalanceHistoryFrom(month, year, 6).pipe(
          map((balances) =>
            balances.map((b, i) => ({
              name: `${MONTH_SHORT[periods[i].month - 1]}/${periods[i].year}`,
              series: [
                { name: 'Receitas', value: sanitizeChartNumber(b.totalIncome) },
                { name: 'Despesas', value: sanitizeChartNumber(b.totalExpenses) },
              ],
            })),
          ),
        );
      }),
    );
  }

  getMonthlyEvolutionData(): Observable<ChartGroupedData[]> {
    return this.monthContext.currentMonth$.pipe(
      switchMap(({ month, year }) =>
        this.balanceService.getBalanceHistoryFrom(month, year, 12).pipe(
          map((balances) => [
            {
              name: 'Saldo',
              series: balances.map((b) => ({
                name: `${MONTH_SHORT[b.month - 1]}/${b.year}`,
                value: sanitizeChartNumber(b.balance),
              })),
            },
          ]),
        ),
      ),
    );
  }

  getPatrimonyEvolutionData(): Observable<ChartGroupedData[]> {
    return this.monthContext.currentMonth$.pipe(
      switchMap(({ month, year }) =>
        this.balanceService
          .getAccumulatedBalanceHistoryFrom(month, year, 12)
          .pipe(
            map((points) => [
              {
                name: 'Patrimônio',
                series: points.map((p) => ({
                  name: `${MONTH_SHORT[p.month - 1]}/${p.year}`,
                  value: sanitizeChartNumber(p.accumulatedBalance),
                })),
              },
            ]),
          ),
      ),
    );
  }

  getCategoryDistribution(): Observable<ChartSingleData[]> {
    return this.monthContext.currentMonth$.pipe(
      switchMap(({ month, year }) =>
        this.expenseService.getByMonth(month, year).pipe(
          map((expenses) => {
            const categoryMap = new Map<ExpenseCategory, number>();

            expenses.forEach((exp) => {
              const current = categoryMap.get(exp.category) ?? 0;
              categoryMap.set(exp.category, current + exp.amount);
            });

            return Array.from(categoryMap.entries())
              .map(([category, value]) => ({
                name: CATEGORY_LABELS[category],
                value: sanitizeChartNumber(Math.round(value * 100) / 100),
              }))
              .sort((a, b) => b.value - a.value);
          }),
        ),
      ),
    );
  }

  private getLast6Months(
    month: number,
    year: number,
  ): { month: number; year: number }[] {
    const periods: { month: number; year: number }[] = [];
    let m = month;
    let y = year;

    for (let i = 0; i < 6; i++) {
      periods.unshift({ month: m, year: y });
      m--;
      if (m === 0) {
        m = 12;
        y--;
      }
    }

    return periods;
  }
}
