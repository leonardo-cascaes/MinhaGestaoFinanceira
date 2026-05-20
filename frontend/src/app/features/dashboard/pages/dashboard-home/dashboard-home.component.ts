import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import {
  DashboardService,
  ChartGroupedData,
  ChartSingleData,
} from '@core/services/dashboard.service';
import { MonthlyBalance } from '@core/models/balance.model';
import { SummaryCardsComponent } from '../../components/summary-cards/summary-cards.component';
import { IncomeVsExpenseChartComponent } from '../../components/income-vs-expense-chart/income-vs-expense-chart.component';
import { MonthlyEvolutionChartComponent } from '../../components/monthly-evolution-chart/monthly-evolution-chart.component';
import { CategoryDistributionChartComponent } from '../../components/category-distribution-chart/category-distribution-chart.component';

export interface DashboardView {
  balance: MonthlyBalance;
  incomeVsExpense: ChartGroupedData[];
  monthlyEvolution: ChartGroupedData[];
  patrimonyEvolution: ChartGroupedData[];
  categoryDistribution: ChartSingleData[];
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    SummaryCardsComponent,
    IncomeVsExpenseChartComponent,
    MonthlyEvolutionChartComponent,
    CategoryDistributionChartComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly view = toSignal(
    combineLatest({
      balance: this.dashboardService.getCurrentBalance(),
      incomeVsExpense: this.dashboardService.getIncomeVsExpenseData(),
      monthlyEvolution: this.dashboardService.getMonthlyEvolutionData(),
      patrimonyEvolution: this.dashboardService.getPatrimonyEvolutionData(),
      categoryDistribution: this.dashboardService.getCategoryDistribution(),
    }),
  );
}
