import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  DashboardService,
  ChartGroupedData,
  ChartSingleData,
} from '@core/services/dashboard.service';
import { MonthlyBalance } from '@core/models/balance.model';
import { Observable } from 'rxjs';
import { SummaryCardsComponent } from '../../components/summary-cards/summary-cards.component';
import { IncomeVsExpenseChartComponent } from '../../components/income-vs-expense-chart/income-vs-expense-chart.component';
import { MonthlyEvolutionChartComponent } from '../../components/monthly-evolution-chart/monthly-evolution-chart.component';
import { CategoryDistributionChartComponent } from '../../components/category-distribution-chart/category-distribution-chart.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    AsyncPipe,
    SummaryCardsComponent,
    IncomeVsExpenseChartComponent,
    MonthlyEvolutionChartComponent,
    CategoryDistributionChartComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly balance$: Observable<MonthlyBalance> =
    this.dashboardService.getCurrentBalance();

  readonly incomeVsExpense$: Observable<ChartGroupedData[]> =
    this.dashboardService.getIncomeVsExpenseData();

  readonly monthlyEvolution$: Observable<ChartGroupedData[]> =
    this.dashboardService.getMonthlyEvolutionData();

  readonly categoryDistribution$: Observable<ChartSingleData[]> =
    this.dashboardService.getCategoryDistribution();
}
