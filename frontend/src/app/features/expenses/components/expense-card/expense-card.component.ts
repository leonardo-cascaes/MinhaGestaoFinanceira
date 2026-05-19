import { Component, computed, input, output } from '@angular/core';
import {
  Expense,
  ExpenseType,
  ExpenseCategory,
  PaymentMethod,
} from '@core/models/expense.model';
import {
  LucideUtensils,
  LucideCar,
  LucideHome,
  LucideHeart,
  LucideGraduationCap,
  LucideGamepad2,
  LucideRepeat,
  LucideShoppingBag,
  LucideCircleDollarSign,
  LucidePencil,
  LucideTrash2,
  LucideFastForward,
} from '@lucide/angular';
import { SubscriptionBadgeComponent } from '../subscription-badge/subscription-badge.component';
import { InstallmentProgressComponent } from '../installment-progress/installment-progress.component';

const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { label: string; cssClass: string }
> = {
  [ExpenseCategory.FOOD]: { label: 'Alimentação', cssClass: 'food' },
  [ExpenseCategory.TRANSPORT]: { label: 'Transporte', cssClass: 'transport' },
  [ExpenseCategory.HOUSING]: { label: 'Moradia', cssClass: 'housing' },
  [ExpenseCategory.HEALTH]: { label: 'Saúde', cssClass: 'health' },
  [ExpenseCategory.EDUCATION]: { label: 'Educação', cssClass: 'education' },
  [ExpenseCategory.ENTERTAINMENT]: {
    label: 'Entretenimento',
    cssClass: 'entertainment',
  },
  [ExpenseCategory.SUBSCRIPTION]: {
    label: 'Assinatura',
    cssClass: 'subscription',
  },
  [ExpenseCategory.SHOPPING]: { label: 'Compras', cssClass: 'shopping' },
  [ExpenseCategory.OTHER]: { label: 'Outros', cssClass: 'other' },
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.PIX]: 'Pix',
  [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
  [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.TRANSFER]: 'Transferência',
};

const currencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [
    LucideUtensils,
    LucideCar,
    LucideHome,
    LucideHeart,
    LucideGraduationCap,
    LucideGamepad2,
    LucideRepeat,
    LucideShoppingBag,
    LucideCircleDollarSign,
    LucidePencil,
    LucideTrash2,
    LucideFastForward,
    SubscriptionBadgeComponent,
    InstallmentProgressComponent,
  ],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.scss',
})
export class ExpenseCardComponent {
  expense = input.required<Expense>();
  currentMonth = input.required<number>();
  currentYear = input.required<number>();
  edit = output<Expense>();
  remove = output<Expense>();
  advance = output<Expense>();

  readonly ExpenseType = ExpenseType;
  readonly ExpenseCategory = ExpenseCategory;

  categoryConfig = computed(() => CATEGORY_CONFIG[this.expense().category]);
  paymentLabel = computed(() => PAYMENT_LABELS[this.expense().paymentMethod]);
  formattedAmount = computed(() => currencyFmt.format(this.expense().amount));

  formattedDate = computed(() => {
    const d = this.expense().date;
    return dateFmt.format(d instanceof Date ? d : new Date(d));
  });

  canAdvance = computed(() => {
    const exp = this.expense();
    if (exp.type !== ExpenseType.INSTALLMENT || !exp.installment) return false;
    const inst = exp.installment;
    const effectiveTotal = inst.advancePayment
      ? inst.totalInstallments - inst.advancePayment.installmentsAdvanced
      : inst.totalInstallments;
    const target = this.currentYear() * 12 + this.currentMonth();
    const start = inst.startYear * 12 + inst.startMonth;
    const currentIdx = target - start + 1;
    return currentIdx < effectiveTotal && !inst.advancePayment;
  });
}
