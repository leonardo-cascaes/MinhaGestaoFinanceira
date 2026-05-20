import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartGroupedData } from '@core/services/dashboard.service';
import {
  formatChartCurrency,
  sanitizeChartNumber,
  seriesTooltipMonth,
  seriesTooltipRows,
  SeriesTooltipRow,
} from '@core/utils/chart-format.util';
import { ChartLineVerticalHoverDirective } from '@shared/directives/chart-line-vertical-hover.directive';
import { ChartTouchTooltipsDirective } from '@shared/directives/chart-touch-tooltips.directive';

@Component({
  selector: 'app-monthly-evolution-chart',
  standalone: true,
  imports: [
    NgxChartsModule,
    ChartTouchTooltipsDirective,
    ChartLineVerticalHoverDirective,
  ],
  templateUrl: './monthly-evolution-chart.component.html',
  styleUrl: './monthly-evolution-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyEvolutionChartComponent {
  data = input.required<ChartGroupedData[]>();
  title = input('Evolução Mensal do Saldo');
  subtitle = input('Últimos 12 meses');
  accentColor = input('#2563eb');

  readonly colorScheme = computed<Color>(() => ({
    name: 'evolution',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [this.accentColor()],
  }));

  readonly referenceLines = [{ name: 'Zero', value: 0 }];

  readonly seriesTooltipMonth = seriesTooltipMonth;
  readonly seriesTooltipRows = seriesTooltipRows;

  formatCurrency = (value: number): string =>
    formatChartCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  formatSeriesValue(value: unknown): string {
    return formatChartCurrency(value, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

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

  showSeriesName(rows: SeriesTooltipRow[]): boolean {
    return rows.length > 1;
  }
}
