import { Component, input } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartGroupedData } from '@core/services/dashboard.service';
import {
  formatChartCurrency,
  sanitizeChartNumber,
} from '@core/utils/chart-format.util';

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

  formatCurrency = (value: number): string =>
    formatChartCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  tooltipValue(model: { value?: number }): string {
    return formatChartCurrency(model?.value, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  tooltipCategory(model: { name?: string; series?: string }): string {
    return model?.name?.trim() || '';
  }

  tooltipSeries(model: { series?: string }): string | null {
    return model?.series?.trim() || null;
  }

  hasTooltipValue(model: { value?: number }): boolean {
    return Number.isFinite(sanitizeChartNumber(model?.value));
  }
}
