import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { LucideCalendar, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
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

export interface CalendarDayCell {
  day: number;
  inMonth: boolean;
  iso: string;
  disabled: boolean;
  selected: boolean;
  today: boolean;
}

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [LucideCalendar, LucideChevronLeft, LucideChevronRight],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent implements ControlValueAccessor {
  inputId = input('');
  min = input<string | null>(null);
  max = input<string | null>(null);
  invalid = input(false);

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly open = signal(false);
  protected readonly viewMonth = signal(new Date().getMonth());
  protected readonly viewYear = signal(new Date().getFullYear());

  protected readonly weekdays = WEEKDAYS;
  protected readonly months = MONTHS;

  protected readonly displayLabel = computed(() => {
    const raw = this.value();
    if (!raw) {
      return 'Selecionar data';
    }
    const date = new Date(`${raw}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      return raw;
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  protected readonly calendarDays = computed(() => this.buildCalendarDays());

  private readonly hostRef = inject(ElementRef<HTMLElement>);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect((onCleanup) => {
      if (!this.open()) {
        return;
      }
      const onDocClick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!this.hostRef.nativeElement.contains(target)) {
          this.closePicker();
        }
      };
      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          this.closePicker();
        }
      };
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onKeyDown);
      onCleanup(() => {
        document.removeEventListener('click', onDocClick, true);
        document.removeEventListener('keydown', onKeyDown);
      });
    });
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    if (value) {
      const parsed = new Date(`${value}T12:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        this.viewMonth.set(parsed.getMonth());
        this.viewYear.set(parsed.getFullYear());
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected togglePicker(): void {
    if (this.disabled()) {
      return;
    }
    if (this.open()) {
      this.closePicker();
      return;
    }
    if (this.value()) {
      const parsed = new Date(`${this.value()}T12:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        this.viewMonth.set(parsed.getMonth());
        this.viewYear.set(parsed.getFullYear());
      }
    }
    this.open.set(true);
  }

  protected closePicker(): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.onTouched();
  }

  protected previousMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
    } else {
      this.viewMonth.update((m) => m - 1);
    }
  }

  protected nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
    } else {
      this.viewMonth.update((m) => m + 1);
    }
  }

  protected selectDay(cell: CalendarDayCell): void {
    if (cell.disabled) {
      return;
    }
    this.value.set(cell.iso);
    this.onChange(cell.iso);
    this.closePicker();
  }

  protected goToToday(): void {
    const now = new Date();
    const iso = this.toIso(now.getFullYear(), now.getMonth(), now.getDate());
    this.value.set(iso);
    this.onChange(iso);
    this.viewMonth.set(now.getMonth());
    this.viewYear.set(now.getFullYear());
    this.closePicker();
  }

  private buildCalendarDays(): CalendarDayCell[] {
    const month = this.viewMonth();
    const year = this.viewYear();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const cells: CalendarDayCell[] = [];

    const minDate = this.min() ? new Date(`${this.min()}T12:00:00`) : null;
    const maxDate = this.max() ? new Date(`${this.max()}T12:00:00`) : null;
    const today = new Date();
    const selected = this.value();

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrev - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      cells.push(this.buildDayCell(day, m, y, false, minDate, maxDate, today, selected));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(this.buildDayCell(day, month, year, true, minDate, maxDate, today, selected));
    }

    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      cells.push(this.buildDayCell(day, m, y, false, minDate, maxDate, today, selected));
    }

    return cells;
  }

  private buildDayCell(
    day: number,
    month: number,
    year: number,
    inMonth: boolean,
    minDate: Date | null,
    maxDate: Date | null,
    today: Date,
    selected: string,
  ): CalendarDayCell {
    const date = new Date(year, month, day);
    const iso = this.toIso(year, month, day);
    let disabled = false;
    if (minDate && date < minDate) {
      disabled = true;
    }
    if (maxDate && date > maxDate) {
      disabled = true;
    }
    return {
      day,
      inMonth,
      iso,
      disabled,
      selected: selected === iso,
      today:
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year,
    };
  }

  private toIso(year: number, month: number, day: number): string {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }
}
