import { Component, computed, effect, input, signal } from '@angular/core';
import {
  NgxChartsModule,
  Color,
  ScaleType,
} from '@swimlane/ngx-charts';
import { ChartSingleData } from '@core/services/dashboard.service';
import {
  applyHiddenToSingleSeries,
  toggleLegendLabel,
} from '@core/utils/chart-legend-toggle.util';
import {
  formatChartCurrency,
  formatChartPercent,
  sanitizeChartNumber,
} from '@core/utils/chart-format.util';
import {
  ChartLegendComponent,
  ChartLegendItem,
} from '@shared/components/chart-legend/chart-legend.component';

@Component({
  selector: 'app-category-distribution-chart',
  standalone: true,
  imports: [NgxChartsModule, ChartLegendComponent],
  templateUrl: './category-distribution-chart.component.html',
  styleUrl: './category-distribution-chart.component.scss',
})
export class CategoryDistributionChartComponent {
  data = input.required<ChartSingleData[]>();

  readonly hiddenCategories = signal<Set<string>>(new Set());

  readonly chartData = computed(() =>
    applyHiddenToSingleSeries(this.data(), this.hiddenCategories()),
  );

  readonly legendItems = computed<ChartLegendItem[]>(() =>
    this.data().map((d, i) => ({
      label: d.name,
      color: this.colorScheme.domain[i % this.colorScheme.domain.length],
    })),
  );

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

  constructor() {
    effect(() => {
      this.data();
      this.hiddenCategories.set(new Set());
    });
  }

  onLegendToggle(label: string): void {
    this.hiddenCategories.update((hidden) => {
      const next = toggleLegendLabel(hidden, label);
      if (next.size >= this.data().length) {
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

  tooltipPercent(model: { value?: number }): string {
    const total = this.data().reduce(
      (sum, d) => sum + sanitizeChartNumber(d.value),
      0,
    );
    return formatChartPercent(model?.value, total);
  }

  hasTooltipValue(model: { value?: number }): boolean {
    return sanitizeChartNumber(model?.value) > 0;
  }
}
