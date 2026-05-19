import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Expense,
  ExpenseType,
  SubscriptionInfo,
  InstallmentInfo,
  AdvancePaymentInfo,
} from '@core/models/expense.model';
import { FAKE_EXPENSES } from '@core/constants/fake-data';
import {
  advanceAmountForMonth,
  effectiveInstallmentTotal,
  getAdvancePayments,
} from '@core/utils/installment-advance.util';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly expenses$ = new BehaviorSubject<Expense[]>(FAKE_EXPENSES);

  getAll(): Observable<Expense[]> {
    return this.expenses$.asObservable();
  }

  getByMonth(month: number, year: number): Observable<Expense[]> {
    return this.expenses$.pipe(
      map((expenses) =>
        expenses.filter((exp) => {
          if (exp.type === ExpenseType.SINGLE) {
            return exp.month === month && exp.year === year;
          }
          if (exp.type === ExpenseType.SUBSCRIPTION) {
            return this.isSubscriptionActive(exp.subscription!, month, year);
          }
          if (exp.type === ExpenseType.INSTALLMENT) {
            return (
              this.getInstallmentForMonth(exp.installment!, month, year) !== null
            );
          }
          return false;
        }),
      ),
    );
  }

  getTotalByMonth(month: number, year: number): Observable<number> {
    return this.expenses$.pipe(
      map((expenses) => {
        let total = 0;

        expenses.forEach((exp) => {
          if (
            exp.type === ExpenseType.SINGLE &&
            exp.month === month &&
            exp.year === year
          ) {
            total += exp.amount;
          }

          if (exp.type === ExpenseType.SUBSCRIPTION) {
            if (this.isSubscriptionActive(exp.subscription!, month, year)) {
              total += exp.amount;
            }
          }

          if (exp.type === ExpenseType.INSTALLMENT) {
            const value = this.getInstallmentForMonth(
              exp.installment!,
              month,
              year,
            );
            if (value !== null) {
              total += value;
            }
          }
        });

        return total;
      }),
    );
  }

  getActiveSubscriptions(month: number, year: number): Observable<Expense[]> {
    return this.expenses$.pipe(
      map((expenses) =>
        expenses.filter(
          (exp) =>
            exp.type === ExpenseType.SUBSCRIPTION &&
            this.isSubscriptionActive(exp.subscription!, month, year),
        ),
      ),
    );
  }

  getInstallmentsByMonth(month: number, year: number): Observable<Expense[]> {
    return this.expenses$.pipe(
      map((expenses) =>
        expenses.filter(
          (exp) =>
            exp.type === ExpenseType.INSTALLMENT &&
            this.getInstallmentForMonth(exp.installment!, month, year) !== null,
        ),
      ),
    );
  }

  add(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = { ...expense, id: crypto.randomUUID() };
    const current = this.expenses$.getValue();
    this.expenses$.next([...current, newExpense]);
  }

  update(id: string, changes: Partial<Expense>): void {
    const current = this.expenses$.getValue();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...changes } : item,
    );
    this.expenses$.next(updated);
  }

  delete(id: string): void {
    const current = this.expenses$.getValue();
    this.expenses$.next(current.filter((item) => item.id !== id));
  }

  cancelSubscription(id: string, cancelDate: Date): void {
    const current = this.expenses$.getValue();
    const updated = current.map((item) => {
      if (item.id === id && item.subscription) {
        return {
          ...item,
          subscription: {
            ...item.subscription,
            cancelledAt: cancelDate,
            isActive: false,
          },
        };
      }
      return item;
    });
    this.expenses$.next(updated);
  }

  advanceInstallments(id: string, info: AdvancePaymentInfo): void {
    const current = this.expenses$.getValue();
    const updated = current.map((item) => {
      if (item.id === id && item.installment) {
        const payments = [...getAdvancePayments(item.installment), info];
        return {
          ...item,
          installment: {
            ...item.installment,
            advancePayments: payments,
            advancePayment: undefined,
          },
        };
      }
      return item;
    });
    this.expenses$.next(updated);
  }

  // ── Private helpers ──────────────────────────────────────────────────

  private toAbsoluteMonth(month: number, year: number): number {
    return year * 12 + month;
  }

  private isSubscriptionActive(
    sub: SubscriptionInfo,
    month: number,
    year: number,
  ): boolean {
    const target = this.toAbsoluteMonth(month, year);
    const start = this.toAbsoluteMonth(sub.startMonth, sub.startYear);

    if (target < start) return false;

    if (sub.isFixed) {
      if (sub.cancelledAt) {
        const cancelMonth = sub.cancelledAt.getMonth() + 1;
        const cancelYear = sub.cancelledAt.getFullYear();
        const cancel = this.toAbsoluteMonth(cancelMonth, cancelYear);
        return target < cancel;
      }
      return true;
    }

    // Assinatura temporária: tem período definido
    if (sub.endMonth != null && sub.endYear != null) {
      const end = this.toAbsoluteMonth(sub.endMonth, sub.endYear);
      return target <= end;
    }

    return true;
  }

  /**
   * Returns the installment value due in the given month, or null if none.
   * Accounts for advance payments that remove the last N installments.
   * When the queried month matches the advance payment date, returns
   * the advance amount instead.
   */
  private getInstallmentForMonth(
    inst: InstallmentInfo,
    month: number,
    year: number,
  ): number | null {
    const target = this.toAbsoluteMonth(month, year);
    const start = this.toAbsoluteMonth(inst.startMonth, inst.startYear);
    const installmentIndex = target - start; // 0-based

    if (installmentIndex < 0) return null;

    const effectiveTotal = effectiveInstallmentTotal(inst);
    const advanceThisMonth = advanceAmountForMonth(inst, month, year);

    if (installmentIndex >= effectiveTotal) {
      return advanceThisMonth > 0 ? advanceThisMonth : null;
    }

    const regular = inst.installmentAmount;
    return advanceThisMonth > 0 ? regular + advanceThisMonth : regular;
  }
}
