import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Income, IncomeType } from '@core/models/income.model';
import {
  hasRecurrenceEnded,
  isRecurringTemplate,
} from '@core/utils/income-recurrence.util';
import { LucideX } from '@lucide/angular';
import { DateInputComponent } from '@shared/components/date-input/date-input.component';

@Component({
  selector: 'app-income-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LucideX, DateInputComponent],
  templateUrl: './income-modal.component.html',
  styleUrl: './income-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeModalComponent implements OnInit {
  income = input<Income | null>(null);
  currentMonth = input.required<number>();
  currentYear = input.required<number>();

  save = output<Omit<Income, 'id'> & { id?: string }>();
  close = output<void>();

  form!: FormGroup;
  showLastRecurrenceField = signal(false);

  readonly incomeTypes = [
    { value: IncomeType.SALARY, label: 'Salário' },
    { value: IncomeType.FREELANCE, label: 'Freelance' },
    { value: IncomeType.INVESTMENT, label: 'Investimento' },
    { value: IncomeType.RENTAL, label: 'Aluguel' },
    { value: IncomeType.BONUS, label: 'Bônus' },
    { value: IncomeType.OTHER, label: 'Outro' },
  ];

  isEditMode = computed(() => !!this.income());
  isRecurringChecked = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private wasRecurringTemplate = false;

  ngOnInit(): void {
    const inc = this.income();
    this.wasRecurringTemplate =
      !!inc?.recurring || (inc != null && hasRecurrenceEnded(inc));

    const startDate = inc?.recurringStartDate ?? inc?.date;
    const defaultDate = this.toDateInput(startDate);

    const defaultLastRecurrence = inc?.recurringEndMonth
      ? this.toDateInput(
          new Date(inc.recurringEndYear!, inc.recurringEndMonth! - 1, 1),
        )
      : this.toDateInput(
          new Date(this.currentYear(), this.currentMonth() - 1, 1),
        );

    const initialRecurring = inc?.recurring ?? false;

    this.form = this.fb.group({
      description: [inc?.description ?? '', Validators.required],
      type: [inc?.type ?? IncomeType.SALARY, Validators.required],
      amount: [
        inc?.amount ?? null,
        [Validators.required, Validators.min(0.01)],
      ],
      month: [
        inc?.month ?? this.currentMonth(),
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      year: [
        inc?.year ?? this.currentYear(),
        [Validators.required, Validators.min(2000)],
      ],
      date: [defaultDate, Validators.required],
      recurring: [initialRecurring],
      lastRecurrenceDate: [defaultLastRecurrence],
      notes: [inc?.notes ?? ''],
    });

    this.isRecurringChecked.set(initialRecurring);
    this.updateLastRecurrenceFieldVisibility();
    this.updateLastRecurrenceValidators();

    this.form
      .get('recurring')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((recurring: boolean) => {
        this.isRecurringChecked.set(!!recurring);
        this.updateLastRecurrenceFieldVisibility();
        this.updateLastRecurrenceValidators();
      });

    this.form
      .get('date')!
      .valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter((dateStr: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((dateStr: string) => {
        if (!this.isRecurringChecked()) {
          return;
        }
        const parsed = new Date(`${dateStr}T12:00:00`);
        if (Number.isNaN(parsed.getTime())) {
          return;
        }
        this.form.patchValue(
          {
            month: parsed.getMonth() + 1,
            year: parsed.getFullYear(),
          },
          { emitEvent: false },
        );
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const original = this.income();
    const template = original && isRecurringTemplate(original);

    const base: Omit<Income, 'id'> & { id?: string } = {
      ...(original?.id ? { id: original.id } : {}),
      description: v.description,
      type: v.type,
      amount: +v.amount,
      month: +v.month,
      year: +v.year,
      date: new Date(v.date + 'T12:00:00'),
      recurring: v.recurring,
      notes: v.notes || undefined,
    };

    if (template && original) {
      if (v.recurring) {
        base.month = +v.month;
        base.year = +v.year;
        base.date = new Date(v.date + 'T12:00:00');
        base.recurringEndMonth = undefined;
        base.recurringEndYear = undefined;
      } else {
        base.month = original.month;
        base.year = original.year;
        base.date =
          original.date instanceof Date
            ? original.date
            : new Date(original.date);
        const last = new Date(v.lastRecurrenceDate + 'T12:00:00');
        base.recurringEndMonth = last.getMonth() + 1;
        base.recurringEndYear = last.getFullYear();
      }
    } else {
      base.month = +v.month;
      base.year = +v.year;
      base.date = new Date(v.date + 'T12:00:00');
      base.recurringEndMonth = undefined;
      base.recurringEndYear = undefined;
    }

    this.save.emit(base);
  }

  private updateLastRecurrenceFieldVisibility(): void {
    const recurring = !!this.form.get('recurring')!.value;
    // Só ao editar uma receita que já era recorrente e o usuário desativa a recorrência
    this.showLastRecurrenceField.set(
      this.isEditMode() && !recurring && this.wasRecurringTemplate,
    );
  }

  private updateLastRecurrenceValidators(): void {
    const ctrl = this.form.get('lastRecurrenceDate')!;
    if (this.showLastRecurrenceField()) {
      ctrl.setValidators([Validators.required]);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity();
  }

  private toDateInput(date?: Date): string {
    const d = date instanceof Date ? date : new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
