import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MonthlyBalance } from '@core/models/balance.model';
import {
  listLastNMonths,
  listMonthsInclusive,
  resolveEarliestActivityPeriod,
  toAbsoluteMonth,
} from '@core/utils/balance-period.util';

export interface AccumulatedBalancePoint {
  month: number;
  year: number;
  accumulatedBalance: number;
}
import { IncomeService } from './income.service';
import { ExpenseService } from './expense.service';

@Injectable({ providedIn: 'root' })
export class BalanceService {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly expenseService: ExpenseService,
  ) {}

  getMonthlyBalance(month: number, year: number): Observable<MonthlyBalance> {
    return combineLatest([
      this.buildMonthlyTotals(month, year),
      this.getAccumulatedBalance(month, year),
    ]).pipe(
      map(([totals, accumulatedBalance]) => ({
        month,
        year,
        ...totals,
        accumulatedBalance,
      })),
    );
  }

  getAccumulatedBalance(upToMonth: number, upToYear: number): Observable<number> {
    return combineLatest([
      this.incomeService.getAll(),
      this.expenseService.getAll(),
    ]).pipe(
      switchMap(([incomes, expenses]) => {
        const start = resolveEarliestActivityPeriod(
          incomes,
          expenses,
          upToMonth,
          upToYear,
        );
        if (!start) {
          return of(0);
        }

        const periods = listMonthsInclusive(
          start.month,
          start.year,
          upToMonth,
          upToYear,
        );

        if (periods.length === 0) {
          return of(0);
        }

        return combineLatest(
          periods.map((p) => this.buildMonthlyTotals(p.month, p.year)),
        ).pipe(
          map((totals) =>
            totals
              .filter((t) => t.totalIncome > 0 || t.totalExpenses > 0)
              .reduce((sum, t) => sum + t.balance, 0),
          ),
        );
      }),
    );
  }

  private buildMonthlyTotals(
    month: number,
    year: number,
  ): Observable<
    Pick<
      MonthlyBalance,
      'totalIncome' | 'totalExpenses' | 'balance' | 'savingsRate'
    >
  > {
    return combineLatest([
      this.incomeService.getTotalByMonth(month, year),
      this.expenseService.getTotalByMonth(month, year),
    ]).pipe(
      map(([totalIncome, totalExpenses]) => {
        const balance = totalIncome - totalExpenses;
        const savingsRate =
          totalIncome > 0
            ? Math.round((balance / totalIncome) * 10000) / 100
            : 0;

        return { totalIncome, totalExpenses, balance, savingsRate };
      }),
    );
  }

  getBalanceHistory(months: number): Observable<MonthlyBalance[]> {
    const now = new Date();
    return this.getBalanceHistoryFrom(now.getMonth() + 1, now.getFullYear(), months);
  }

  getBalanceHistoryFrom(month: number, year: number, count: number): Observable<MonthlyBalance[]> {
    let m = month;
    let y = year;
    const observables: Observable<MonthlyBalance>[] = [];

    for (let i = 0; i < count; i++) {
      const month = m;
      const year = y;
      observables.push(
        this.buildMonthlyTotals(month, year).pipe(
          map((totals) => ({
            month,
            year,
            ...totals,
            accumulatedBalance: 0,
          })),
        ),
      );
      m--;
      if (m === 0) {
        m = 12;
        y--;
      }
    }

    return combineLatest(observables).pipe(
      map((balances) => balances.reverse()),
    );
  }

  getAccumulatedBalanceHistoryFrom(
    endMonth: number,
    endYear: number,
    count: number,
  ): Observable<AccumulatedBalancePoint[]> {
    return combineLatest([
      this.incomeService.getAll(),
      this.expenseService.getAll(),
    ]).pipe(
      switchMap(([incomes, expenses]) => {
        const activityStart = resolveEarliestActivityPeriod(
          incomes,
          expenses,
          endMonth,
          endYear,
        );
        if (!activityStart) {
          return of([]);
        }

        const chartPeriods = listLastNMonths(endMonth, endYear, count);
        const allPeriods = listMonthsInclusive(
          activityStart.month,
          activityStart.year,
          endMonth,
          endYear,
        );

        if (allPeriods.length === 0) {
          return of([]);
        }

        return combineLatest(
          allPeriods.map((p) => this.buildMonthlyTotals(p.month, p.year)),
        ).pipe(
          map((totals) => {
            let running = 0;
            const cumulativeByAbsolute = new Map<number, number>();

            allPeriods.forEach((period, index) => {
              const t = totals[index];
              if (t.totalIncome > 0 || t.totalExpenses > 0) {
                running += t.balance;
              }
              cumulativeByAbsolute.set(
                toAbsoluteMonth(period.month, period.year),
                running,
              );
            });

            const activityStartAbs = toAbsoluteMonth(
              activityStart.month,
              activityStart.year,
            );

            return chartPeriods.map((period) => {
              const abs = toAbsoluteMonth(period.month, period.year);
              const value =
                abs < activityStartAbs
                  ? 0
                  : (cumulativeByAbsolute.get(abs) ?? 0);

              return {
                month: period.month,
                year: period.year,
                accumulatedBalance: Math.round(value * 100) / 100,
              };
            });
          }),
        );
      }),
    );
  }
}
