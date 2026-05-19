import { Component, input } from '@angular/core';
import {
  NgxChartsModule,
  Color,
  ScaleType,
  LegendPosition,
} from '@swimlane/ngx-charts';
import { ChartGroupedData } from '@core/services/dashboard.service';

@Component({
  selector: 'app-income-vs-expense-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './income-vs-expense-chart.component.html',
  styleUrl: './income-vs-expense-chart.component.scss',
})
export class IncomeVsExpenseChartComponent {
  data = input.required<ChartGroupedData[]>();

  readonly legendBelow = LegendPosition.Below;

  readonly colorScheme: Color = {
    name: 'incomeExpense',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10b981', '#ef4444'],
  };

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
