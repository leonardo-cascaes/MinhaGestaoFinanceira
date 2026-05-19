import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonthlyBalance } from '@core/models/balance.model';
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
      this.incomeService.getTotalByMonth(month, year),
      this.expenseService.getTotalByMonth(month, year),
    ]).pipe(
      map(([totalIncome, totalExpenses]) => {
        const balance = totalIncome - totalExpenses;
        const savingsRate =
          totalIncome > 0
            ? Math.round((balance / totalIncome) * 10000) / 100
            : 0;

        return { month, year, totalIncome, totalExpenses, balance, savingsRate };
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
      observables.push(this.getMonthlyBalance(m, y));
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
}
