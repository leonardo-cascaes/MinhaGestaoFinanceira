import { Component, computed, effect, input, signal } from '@angular/core';
import {
  NgxChartsModule,
  Color,
  ScaleType,
} from '@swimlane/ngx-charts';
import { ChartGroupedData } from '@core/services/dashboard.service';
import {
  applyHiddenToGroupedSeries,
  toggleLegendLabel,
} from '@core/utils/chart-legend-toggle.util';
import {
  formatChartCurrency,
  sanitizeChartNumber,
} from '@core/utils/chart-format.util';
import {
  ChartLegendComponent,
  ChartLegendItem,
} from '@shared/components/chart-legend/chart-legend.component';

@Component({
  selector: 'app-income-vs-expense-chart',
  standalone: true,
  imports: [NgxChartsModule, ChartLegendComponent],
  templateUrl: './income-vs-expense-chart.component.html',
  styleUrl: './income-vs-expense-chart.component.scss',
})
export class IncomeVsExpenseChartComponent {
  data = input.required<ChartGroupedData[]>();

  readonly hiddenSeries = signal<Set<string>>(new Set());

  readonly chartData = computed(() =>
    applyHiddenToGroupedSeries(this.data(), this.hiddenSeries()),
  );

  readonly legendItems: ChartLegendItem[] = [
    { label: 'Receitas', color: '#10b981' },
    { label: 'Despesas', color: '#ef4444' },
  ];

  readonly colorScheme: Color = {
    name: 'incomeExpense',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10b981', '#ef4444'],
  };

  constructor() {
    effect(() => {
      this.data();
      this.hiddenSeries.set(new Set());
    });
  }

  formatCurrency = (value: number): string =>
    formatChartCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  onLegendToggle(label: string): void {
    this.hiddenSeries.update((hidden) => {
      const next = toggleLegendLabel(hidden, label);
      if (next.size >= this.legendItems.length) {
        return hidden;
      }
      return next;
    });
  }

  tooltipValue(model: { value?: number }): string {
    return formatChartCurrency(model?.value, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  tooltipSeries(model: { series?: string; name?: string }): string | null {
    const series = model?.series?.trim();
    if (series && series !== model?.name) {
      return series;
    }
    return null;
  }

  tooltipCategory(model: { name?: string; series?: string }): string {
    return model?.name?.trim() || model?.series?.trim() || '';
  }

  hasTooltipValue(model: { value?: number }): boolean {
    return sanitizeChartNumber(model?.value) > 0;
  }
}
