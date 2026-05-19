import { Component, input } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartGroupedData } from '@core/services/dashboard.service';

@Component({
  selector: 'app-monthly-evolution-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './monthly-evolution-chart.component.html',
  styleUrl: './monthly-evolution-chart.component.scss',
})
export class MonthlyEvolutionChartComponent {
  data = input.required<ChartGroupedData[]>();

  readonly colorScheme: Color = {
    name: 'evolution',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2563eb'],
  };

  readonly referenceLines = [{ name: 'Zero', value: 0 }];

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
