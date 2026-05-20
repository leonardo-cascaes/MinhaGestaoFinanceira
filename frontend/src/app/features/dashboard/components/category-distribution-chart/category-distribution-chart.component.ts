import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import {
  NgxChartsModule,
  Color,
  ScaleType,
} from '@swimlane/ngx-charts';
import { ChartSingleData } from '@core/services/dashboard.service';
import {
  applyHiddenToSingleSeriesInPlace,
  toggleLegendLabel,
} from '@core/utils/chart-legend-toggle.util';
import {
  formatChartCurrency,
  formatChartPercent,
  sanitizeChartNumber,
} from '@core/utils/chart-format.util';
import {
  CHART_CATEGORY_PALETTE,
  colorForCategoryName,
  customColorsForCategoryNames,
} from '@core/utils/chart-color.util';
import {
  ChartLegendComponent,
  ChartLegendItem,
} from '@shared/components/chart-legend/chart-legend.component';
import { ChartTouchTooltipsDirective } from '@shared/directives/chart-touch-tooltips.directive';

@Component({
  selector: 'app-category-distribution-chart',
  standalone: true,
  imports: [NgxChartsModule, ChartLegendComponent, ChartTouchTooltipsDirective],
  templateUrl: './category-distribution-chart.component.html',
  styleUrl: './category-distribution-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDistributionChartComponent {
  data = input.required<ChartSingleData[]>();

  readonly hiddenCategories = signal<Set<string>>(new Set());

  readonly chartData = computed(() =>
    applyHiddenToSingleSeriesInPlace(this.data(), this.hiddenCategories()),
  );

  readonly hasVisibleSlices = computed(() =>
    this.chartData().some((d) => sanitizeChartNumber(d.value) > 0),
  );

  /** Cores fixas por nome (lista completa), mesmo com categorias ocultas no gráfico. */
  readonly customColors = computed(() =>
    customColorsForCategoryNames(this.data().map((d) => d.name)),
  );

  readonly legendItems = computed<ChartLegendItem[]>(() =>
    this.data().map((d, i) => ({
      label: d.name,
      color: colorForCategoryName(d.name, i),
    })),
  );

  readonly colorScheme = computed<Color>(() => ({
    name: 'categories',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [...CHART_CATEGORY_PALETTE],
  }));

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
