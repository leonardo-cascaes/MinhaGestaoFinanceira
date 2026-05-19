import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap } from 'rxjs';
import { MonthContextService } from '@core/services/month-context.service';
import { ExpenseService } from '@core/services/expense.service';
import { BalanceService } from '@core/services/balance.service';
import {
  Expense,
  ExpenseType,
  AdvancePaymentInfo,
} from '@core/models/expense.model';
import { MonthlyBalance } from '@core/models/balance.model';
import { ExpenseCardComponent } from '../../components/expense-card/expense-card.component';
import { ExpenseModalComponent } from '../../components/expense-modal/expense-modal.component';
import { AdvanceModalComponent } from '../../components/advance-modal/advance-modal.component';
import {
  LucidePlus,
  LucideInbox,
  LucideWallet,
  LucideTrendingDown,
} from '@lucide/angular';

const currencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [
    ExpenseCardComponent,
    ExpenseModalComponent,
    AdvanceModalComponent,
    LucidePlus,
    LucideInbox,
    LucideWallet,
    LucideTrendingDown,
  ],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.scss',
})
export class ExpensesListComponent implements OnInit {
  private readonly monthCtx = inject(MonthContextService);
  private readonly expenseService = inject(ExpenseService);
  private readonly balanceService = inject(BalanceService);
  private readonly destroyRef = inject(DestroyRef);

  expenses = signal<Expense[]>([]);
  balance = signal<MonthlyBalance | null>(null);
  currentMonth = signal(this.monthCtx.currentValue.month);
  currentYear = signal(this.monthCtx.currentValue.year);

  showModal = signal(false);
  editingExpense = signal<Expense | null>(null);
  advancingExpense = signal<Expense | null>(null);

  singleExpenses = computed(() =>
    this.expenses().filter((e) => e.type === ExpenseType.SINGLE),
  );

  subscriptionExpenses = computed(() =>
    this.expenses().filter((e) => e.type === ExpenseType.SUBSCRIPTION),
  );

  installmentExpenses = computed(() =>
    this.expenses().filter((e) => e.type === ExpenseType.INSTALLMENT),
  );

  totalExpenses = computed(() =>
    currencyFmt.format(this.balance()?.totalExpenses ?? 0),
  );

  totalIncome = computed(() =>
    currencyFmt.format(this.balance()?.totalIncome ?? 0),
  );

  balanceValue = computed(() =>
    currencyFmt.format(this.balance()?.balance ?? 0),
  );

  balanceIsPositive = computed(() => (this.balance()?.balance ?? 0) >= 0);

  ngOnInit(): void {
    this.monthCtx.currentMonth$
      .pipe(
        switchMap(({ month, year }) => {
          this.currentMonth.set(month);
          this.currentYear.set(year);
          return combineLatest([
            this.expenseService.getByMonth(month, year),
            this.balanceService.getMonthlyBalance(month, year),
          ]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([expenses, balance]) => {
        this.expenses.set(expenses);
        this.balance.set(balance);
      });
  }

  openCreateModal(): void {
    this.editingExpense.set(null);
    this.showModal.set(true);
  }

  openEditModal(expense: Expense): void {
    this.editingExpense.set(expense);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingExpense.set(null);
  }

  onSave(data: Omit<Expense, 'id'> & { id?: string }): void {
    if (data.id) {
      this.expenseService.update(data.id, data);
    } else {
      this.expenseService.add(data);
    }
    this.closeModal();
  }

  onDelete(expense: Expense): void {
    this.expenseService.delete(expense.id);
  }

  openAdvanceModal(expense: Expense): void {
    this.advancingExpense.set(expense);
  }

  closeAdvanceModal(): void {
    this.advancingExpense.set(null);
  }

  onAdvanceConfirm(event: { expenseId: string; info: AdvancePaymentInfo }): void {
    this.expenseService.advanceInstallments(event.expenseId, event.info);
    this.closeAdvanceModal();
  }
}
