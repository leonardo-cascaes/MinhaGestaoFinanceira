import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Income, IncomeType } from '@core/models/income.model';
import { hasRecurrenceEnded } from '@core/utils/income-recurrence.util';
import { LucideX } from '@lucide/angular';
import { DateInputComponent } from '@shared/components/date-input/date-input.component';

@Component({
  selector: 'app-income-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LucideX, DateInputComponent],
  templateUrl: './income-modal.component.html',
  styleUrl: './income-modal.component.scss',
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

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private wasRecurringTemplate = false;

  ngOnInit(): void {
    const inc = this.income();
    this.wasRecurringTemplate =
      !!inc?.recurring || (inc != null && hasRecurrenceEnded(inc));

    const defaultLastRecurrence = inc?.recurringEndMonth
      ? this.toDateInput(
          new Date(inc.recurringEndYear!, inc.recurringEndMonth! - 1, 1),
        )
      : this.toDateInput(
          new Date(this.currentYear(), this.currentMonth() - 1, 1),
        );

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
      date: [this.toDateInput(inc?.date), Validators.required],
      recurring: [inc?.recurring ?? false],
      lastRecurrenceDate: [defaultLastRecurrence],
      notes: [inc?.notes ?? ''],
    });

    this.updateLastRecurrenceFieldVisibility();
    this.updateLastRecurrenceValidators();

    this.form
      .get('recurring')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateLastRecurrenceFieldVisibility();
        this.updateLastRecurrenceValidators();
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const base: Omit<Income, 'id'> & { id?: string } = {
      ...(this.income()?.id ? { id: this.income()!.id } : {}),
      description: v.description,
      type: v.type,
      amount: +v.amount,
      month: +v.month,
      year: +v.year,
      date: new Date(v.date + 'T12:00:00'),
      recurring: v.recurring,
      notes: v.notes || undefined,
    };

    if (v.recurring) {
      base.recurringEndMonth = undefined;
      base.recurringEndYear = undefined;
    } else if (this.showLastRecurrenceField()) {
      const last = new Date(v.lastRecurrenceDate + 'T12:00:00');
      base.recurringEndMonth = last.getMonth() + 1;
      base.recurringEndYear = last.getFullYear();
    } else {
      base.recurringEndMonth = undefined;
      base.recurringEndYear = undefined;
    }

    this.save.emit(base);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  private updateLastRecurrenceFieldVisibility(): void {
    const recurring = !!this.form.get('recurring')!.value;
    if (recurring) {
      this.wasRecurringTemplate = true;
    }
    this.showLastRecurrenceField.set(!recurring && this.wasRecurringTemplate);
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
