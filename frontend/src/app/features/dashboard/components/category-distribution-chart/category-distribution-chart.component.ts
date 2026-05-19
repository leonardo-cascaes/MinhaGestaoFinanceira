import { Component, input } from '@angular/core';
import {
  NgxChartsModule,
  Color,
  ScaleType,
  LegendPosition,
} from '@swimlane/ngx-charts';
import { ChartSingleData } from '@core/services/dashboard.service';

@Component({
  selector: 'app-category-distribution-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './category-distribution-chart.component.html',
  styleUrl: './category-distribution-chart.component.scss',
})
export class CategoryDistributionChartComponent {
  data = input.required<ChartSingleData[]>();

  readonly legendBelow = LegendPosition.Below;

  readonly colorScheme: Color = {
    name: 'categories',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#2563eb', '#10b981', '#f59e0b', '#ef4444',
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
      '#64748b',
    ],
  };

  formatPercent(name: string, value: number): string {
    const total = this.data().reduce((sum, d) => sum + d.value, 0);
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
    return `${name}: ${pct}%`;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }
}
