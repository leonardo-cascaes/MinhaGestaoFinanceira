import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Income, IncomeType } from '@core/models/income.model';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-income-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LucideX],
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

  ngOnInit(): void {
    const inc = this.income();
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
      notes: [inc?.notes ?? ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.save.emit({
      ...(this.income()?.id ? { id: this.income()!.id } : {}),
      description: v.description,
      type: v.type,
      amount: +v.amount,
      month: +v.month,
      year: +v.year,
      date: new Date(v.date + 'T12:00:00'),
      recurring: v.recurring,
      notes: v.notes || undefined,
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  private toDateInput(date?: Date): string {
    const d = date instanceof Date ? date : new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
