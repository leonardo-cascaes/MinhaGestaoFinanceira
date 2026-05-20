import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MonthYear {
  month: number; // 1-12
  year: number;
}

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

@Injectable({ providedIn: 'root' })
export class MonthContextService {
  private readonly currentMonthSubject: BehaviorSubject<MonthYear>;

  readonly currentMonth$: Observable<MonthYear>;
  readonly monthLabel$: Observable<string>;

  constructor() {
    const now = new Date();
    this.currentMonthSubject = new BehaviorSubject<MonthYear>({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
    this.currentMonth$ = this.currentMonthSubject.asObservable();
    this.monthLabel$ = this.currentMonth$.pipe(
      map(({ month, year }) => `${MESES[month - 1]} ${year}`),
    );
  }

  get currentValue(): MonthYear {
    return this.currentMonthSubject.getValue();
  }

  setMonth(month: number, year: number): void {
    this.currentMonthSubject.next({ month, year });
  }

  nextMonth(): void {
    const { month, year } = this.currentValue;
    if (month === 12) {
      this.currentMonthSubject.next({ month: 1, year: year + 1 });
    } else {
      this.currentMonthSubject.next({ month: month + 1, year });
    }
  }

  previousMonth(): void {
    const { month, year } = this.currentValue;
    if (month === 1) {
      this.currentMonthSubject.next({ month: 12, year: year - 1 });
    } else {
      this.currentMonthSubject.next({ month: month - 1, year });
    }
  }

  getMonthLabel(month?: number, year?: number): string {
    const m = month ?? this.currentValue.month;
    const y = year ?? this.currentValue.year;
    return `${MESES[m - 1]} ${y}`;
  }

  goToCurrentMonth(): void {
    const now = new Date();
    this.setMonth(now.getMonth() + 1, now.getFullYear());
  }

  isCurrentCalendarMonth(month: number, year: number): boolean {
    const now = new Date();
    return month === now.getMonth() + 1 && year === now.getFullYear();
  }
}
