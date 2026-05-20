import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  computed,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  imports: [LucideChevronLeft, LucideChevronRight, LucideChevronDown],
  templateUrl: './month-selector.component.html',
  styleUrl: './month-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    effect(() => {
      const { year } = this.currentMonth();
      this.dropdownYear.set(year);
    });

    effect((onCleanup) => {
      if (!this.dropdownOpen()) {
        return;
      }
      const handler = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!target.closest('.month-selector__dropdown-wrapper')) {
          this.dropdownOpen.set(false);
        }
      };
      document.addEventListener('click', handler, true);
      onCleanup(() => document.removeEventListener('click', handler, true));
    });
  }

  previousMonth(): void {
    this.monthContext.previousMonth();
  }

  nextMonth(): void {
    this.monthContext.nextMonth();
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  selectMonth(month: number): void {
    this.monthContext.setMonth(month, this.dropdownYear());
    this.dropdownOpen.set(false);
  }

  previousYear(): void {
    this.dropdownYear.update((y) => y - 1);
  }

  nextYear(): void {
    this.dropdownYear.update((y) => y + 1);
  }

  isCurrentSelection(monthIndex: number): boolean {
    const { month, year } = this.monthContext.currentValue;
    return month === monthIndex + 1 && year === this.dropdownYear();
  }

  isViewingCurrentMonth(): boolean {
    const { month, year } = this.currentMonth();
    return this.monthContext.isCurrentCalendarMonth(month, year);
  }

  goToCurrentMonth(): void {
    this.monthContext.goToCurrentMonth();
    const now = new Date();
    this.dropdownYear.set(now.getFullYear());
    this.dropdownOpen.set(false);
  }
}
