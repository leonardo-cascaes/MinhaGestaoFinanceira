import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Income } from '@core/models/income.model';
import { FAKE_INCOMES } from '@core/constants/fake-data';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly incomes$ = new BehaviorSubject<Income[]>(FAKE_INCOMES);

  getAll(): Observable<Income[]> {
    return this.incomes$.asObservable();
  }

  getByMonth(month: number, year: number): Observable<Income[]> {
    return this.incomes$.pipe(
      map((incomes) =>
        incomes.filter((i) => i.month === month && i.year === year),
      ),
    );
  }

  getTotalByMonth(month: number, year: number): Observable<number> {
    return this.getByMonth(month, year).pipe(
      map((incomes) => incomes.reduce((sum, i) => sum + i.amount, 0)),
    );
  }

  add(income: Omit<Income, 'id'>): void {
    const newIncome: Income = { ...income, id: crypto.randomUUID() };
    const current = this.incomes$.getValue();
    this.incomes$.next([...current, newIncome]);
  }

  update(id: string, changes: Partial<Income>): void {
    const current = this.incomes$.getValue();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...changes } : item,
    );
    this.incomes$.next(updated);
  }

  delete(id: string): void {
    const current = this.incomes$.getValue();
    this.incomes$.next(current.filter((item) => item.id !== id));
  }
}
