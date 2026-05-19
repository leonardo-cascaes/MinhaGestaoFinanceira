import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Expense,
  ExpenseType,
  ExpenseCategory,
  PaymentMethod,
} from '@core/models/expense.model';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LucideX],
  templateUrl: './expense-modal.component.html',
  styleUrl: './expense-modal.component.scss',
})
export class ExpenseModalComponent implements OnInit {
  expense = input<Expense | null>(null);
  currentMonth = input.required<number>();
  currentYear = input.required<number>();

  save = output<Omit<Expense, 'id'> & { id?: string }>();
  close = output<void>();

  form!: FormGroup;

  readonly expenseTypes = [
    { value: ExpenseType.SINGLE, label: 'Avulsa' },
    { value: ExpenseType.SUBSCRIPTION, label: 'Assinatura' },
    { value: ExpenseType.INSTALLMENT, label: 'Parcelamento' },
  ];

  readonly categories = [
    { value: ExpenseCategory.FOOD, label: 'Alimentação' },
    { value: ExpenseCategory.TRANSPORT, label: 'Transporte' },
    { value: ExpenseCategory.HOUSING, label: 'Moradia' },
    { value: ExpenseCategory.HEALTH, label: 'Saúde' },
    { value: ExpenseCategory.EDUCATION, label: 'Educação' },
    { value: ExpenseCategory.ENTERTAINMENT, label: 'Entretenimento' },
    { value: ExpenseCategory.SUBSCRIPTION, label: 'Assinatura' },
    { value: ExpenseCategory.SHOPPING, label: 'Compras' },
    { value: ExpenseCategory.OTHER, label: 'Outros' },
  ];

  readonly paymentMethods = [
    { value: PaymentMethod.PIX, label: 'Pix' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de Débito' },
    { value: PaymentMethod.CASH, label: 'Dinheiro' },
    { value: PaymentMethod.TRANSFER, label: 'Transferência' },
  ];

  readonly installmentPaymentMethods = [
    { value: PaymentMethod.PIX, label: 'Pix' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito' },
  ];

  readonly ExpenseType = ExpenseType;
  isEditMode = computed(() => !!this.expense());

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const exp = this.expense();
    const type = exp?.type ?? ExpenseType.SINGLE;

    this.form = this.fb.group({
      description: [exp?.description ?? '', Validators.required],
      type: [type, Validators.required],
      category: [exp?.category ?? ExpenseCategory.OTHER, Validators.required],
      amount: [
        exp?.amount ?? null,
        [Validators.required, Validators.min(0.01)],
      ],
      paymentMethod: [
        exp?.paymentMethod ?? PaymentMethod.PIX,
        Validators.required,
      ],
      notes: [exp?.notes ?? ''],

      // Subscription fields
      subIsFixed: [exp?.subscription?.isFixed ?? true],
      subStartMonth: [exp?.subscription?.startMonth ?? this.currentMonth()],
      subStartYear: [exp?.subscription?.startYear ?? this.currentYear()],
      subEndMonth: [exp?.subscription?.endMonth ?? this.currentMonth()],
      subEndYear: [exp?.subscription?.endYear ?? this.currentYear()],

      // Installment fields
      instTotalAmount: [
        exp?.installment?.totalAmount ?? null,
        Validators.min(0.01),
      ],
      instTotalInstallments: [
        exp?.installment?.totalInstallments ?? 2,
        [Validators.min(2), Validators.max(120)],
      ],
      instStartMonth: [exp?.installment?.startMonth ?? this.currentMonth()],
      instStartYear: [exp?.installment?.startYear ?? this.currentYear()],
      instPaymentMethod: [
        exp?.installment?.paymentMethod ?? PaymentMethod.CREDIT_CARD,
      ],
    });

    this.form
      .get('type')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onTypeChange());

    this.onTypeChange();
  }

  get selectedType(): ExpenseType {
    return this.form.get('type')!.value;
  }

  get isFixed(): boolean {
    return this.form.get('subIsFixed')!.value;
  }

  onTypeChange(): void {
    const type = this.selectedType;

    if (type === ExpenseType.INSTALLMENT) {
      this.form.get('instTotalAmount')!.setValidators([
        Validators.required,
        Validators.min(0.01),
      ]);
      this.form.get('instTotalInstallments')!.setValidators([
        Validators.required,
        Validators.min(2),
        Validators.max(120),
      ]);
    } else {
      this.form.get('instTotalAmount')!.clearValidators();
      this.form.get('instTotalInstallments')!.clearValidators();
    }

    this.form.get('instTotalAmount')!.updateValueAndValidity();
    this.form.get('instTotalInstallments')!.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const type: ExpenseType = v.type;
    const amount = type === ExpenseType.INSTALLMENT
      ? +v.instTotalAmount / +v.instTotalInstallments
      : +v.amount;

    const base: Omit<Expense, 'id'> & { id?: string } = {
      ...(this.expense()?.id ? { id: this.expense()!.id } : {}),
      description: v.description,
      type,
      category: v.category,
      amount,
      month: this.currentMonth(),
      year: this.currentYear(),
      date: new Date(),
      paymentMethod: v.paymentMethod,
      notes: v.notes || undefined,
    };

    if (type === ExpenseType.SUBSCRIPTION) {
      base.subscription = {
        isFixed: v.subIsFixed,
        startMonth: +v.subStartMonth,
        startYear: +v.subStartYear,
        endMonth: v.subIsFixed ? undefined : +v.subEndMonth,
        endYear: v.subIsFixed ? undefined : +v.subEndYear,
        isActive: true,
      };
    }

    if (type === ExpenseType.INSTALLMENT) {
      const totalAmount = +v.instTotalAmount;
      const totalInstallments = +v.instTotalInstallments;
      const installmentAmount = Math.round((totalAmount / totalInstallments) * 100) / 100;

      base.amount = installmentAmount;
      base.month = +v.instStartMonth;
      base.year = +v.instStartYear;
      base.installment = {
        totalInstallments,
        currentInstallment: 1,
        installmentAmount,
        totalAmount,
        startMonth: +v.instStartMonth,
        startYear: +v.instStartYear,
        paymentMethod: v.instPaymentMethod,
      };
    }

    this.save.emit(base);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
