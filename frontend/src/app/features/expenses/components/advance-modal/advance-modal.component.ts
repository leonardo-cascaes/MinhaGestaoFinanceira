import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Expense, AdvancePaymentInfo } from '@core/models/expense.model';
import { LucideX, LucideAlertTriangle } from '@lucide/angular';
import { DecimalPipe } from '@angular/common';

const currencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

@Component({
  selector: 'app-advance-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LucideX, LucideAlertTriangle, DecimalPipe],
  templateUrl: './advance-modal.component.html',
  styleUrl: './advance-modal.component.scss',
})
export class AdvanceModalComponent implements OnInit {
  expense = input.required<Expense>();
  currentMonth = input.required<number>();
  currentYear = input.required<number>();

  confirm = output<{ expenseId: string; info: AdvancePaymentInfo }>();
  close = output<void>();

  form!: FormGroup;
  showPreview = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly qty = signal(1);
  private readonly paid = signal(0);

  maxAdvanceable = computed(() => {
    const inst = this.expense().installment!;
    const target = this.currentYear() * 12 + this.currentMonth();
    const start = inst.startYear * 12 + inst.startMonth;
    const currentIdx = target - start + 1;
    return inst.totalInstallments - currentIdx;
  });

  originalTotal = computed(() =>
    this.qty() * this.expense().installment!.installmentAmount,
  );

  formattedOriginalTotal = computed(() =>
    currencyFmt.format(this.originalTotal()),
  );

  discount = computed(() =>
    Math.max(this.originalTotal() - this.paid(), 0),
  );

  formattedDiscount = computed(() => currencyFmt.format(this.discount()));

  formattedAmountPaid = computed(() => currencyFmt.format(this.paid()));

  ngOnInit(): void {
    this.form = this.fb.group({
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(this.maxAdvanceable())],
      ],
      amountPaid: [
        null,
        [Validators.required, Validators.min(0.01)],
      ],
    });

    this.form.get('quantity')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(v => this.qty.set(+v || 0));

    this.form.get('amountPaid')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(v => this.paid.set(+v || 0));
  }

  updatePreview(): void {
    this.showPreview.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const qty = +v.quantity;
    const amountPaid = +v.amountPaid;
    const originalAmount = qty * this.expense().installment!.installmentAmount;

    const info: AdvancePaymentInfo = {
      installmentsAdvanced: qty,
      amountPaid,
      originalAmount,
      discount: originalAmount - amountPaid,
      date: new Date(),
    };

    this.confirm.emit({ expenseId: this.expense().id, info });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
