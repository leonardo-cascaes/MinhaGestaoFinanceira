import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { MonthContextService } from '@core/services/month-context.service';
import { IncomeService } from '@core/services/income.service';
import { Income } from '@core/models/income.model';
import { IncomeCardComponent } from '../../components/income-card/income-card.component';
import { IncomeModalComponent } from '../../components/income-modal/income-modal.component';
import { LucidePlus, LucideInbox } from '@lucide/angular';

const currencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

@Component({
  selector: 'app-income-list',
  standalone: true,
  imports: [
    IncomeCardComponent,
    IncomeModalComponent,
    LucidePlus,
    LucideInbox,
  ],
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeListComponent implements OnInit {
  private readonly monthCtx = inject(MonthContextService);
  private readonly incomeService = inject(IncomeService);
  private readonly destroyRef = inject(DestroyRef);

  incomes = signal<Income[]>([]);
  currentMonth = signal(this.monthCtx.currentValue.month);
  currentYear = signal(this.monthCtx.currentValue.year);

  showModal = signal(false);
  editingIncome = signal<Income | null>(null);

  total = computed(() =>
    this.incomes().reduce((sum, i) => sum + i.amount, 0),
  );

  formattedTotal = computed(() => currencyFmt.format(this.total()));

  ngOnInit(): void {
    this.monthCtx.currentMonth$
      .pipe(
        switchMap(({ month, year }) => {
          this.currentMonth.set(month);
          this.currentYear.set(year);
          return this.incomeService.getByMonth(month, year);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((incomes) => this.incomes.set(incomes));
  }

  openCreateModal(): void {
    this.editingIncome.set(null);
    this.showModal.set(true);
  }

  openEditModal(income: Income): void {
    const original = this.incomeService.getById(income.id) ?? income;
    this.editingIncome.set(original);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingIncome.set(null);
  }

  onSave(data: Omit<Income, 'id'> & { id?: string }): void {
    if (data.id) {
      this.incomeService.update(data.id, data);
    } else {
      this.incomeService.add(data);
    }
    this.closeModal();
  }

  onDelete(income: Income): void {
    this.incomeService.delete(income.id);
  }
}
