import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { LucideChevronLeft, LucideChevronRight, LucideChevronDown } from '@lucide/angular';
import { MonthContextService } from '../../../core/services/month-context.service';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

@Component({
  selector: 'app-month-selector',
  standalone: true,
  imports: [CommonModule, LucideChevronLeft, LucideChevronRight, LucideChevronDown],
  templateUrl: './month-selector.component.html',
  styleUrl: './month-selector.component.scss',
  animations: [
    trigger('monthChange', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(-4px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50%) translateY(-8px) scale(0.96)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateX(-50%) translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateX(-50%) translateY(-8px) scale(0.96)' })),
      ]),
    ]),
  ],
})
export class MonthSelectorComponent {
  private readonly monthContext = inject(MonthContextService);

  readonly meses = MESES;
  readonly dropdownOpen = signal(false);
  readonly dropdownYear = signal(new Date().getFullYear());

  private readonly currentMonth = toSignal(this.monthContext.currentMonth$, {
    initialValue: this.monthContext.currentValue,
  });

  readonly monthLabel = computed(() => {
    const { month, year } = this.currentMonth();
    return `${MESES[month - 1]} ${year}`;
  });

  constructor() {
    this.monthContext.currentMonth$
      .pipe(takeUntilDestroyed())
      .subscribe(({ year }) => {
        this.dropdownYear.set(year);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.month-selector__dropdown-wrapper')) {
      this.dropdownOpen.set(false);
    }
  }

  previousMonth(): void {
    this.monthContext.previousMonth();
  }

  nextMonth(): void {
    this.monthContext.nextMonth();
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  selectMonth(month: number): void {
    this.monthContext.setMonth(month, this.dropdownYear());
    this.dropdownOpen.set(false);
  }

  previousYear(): void {
    this.dropdownYear.update(y => y - 1);
  }

  nextYear(): void {
    this.dropdownYear.update(y => y + 1);
  }

  isCurrentSelection(monthIndex: number): boolean {
    const { month, year } = this.monthContext.currentValue;
    return month === monthIndex + 1 && year === this.dropdownYear();
  }
}
