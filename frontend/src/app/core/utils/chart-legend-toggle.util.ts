import { ChartGroupedData, ChartSingleData } from '@core/services/dashboard.service';
import { sanitizeChartNumber } from './chart-format.util';

/** Alterna um rótulo no conjunto de séries/categorias ocultas. */
export function toggleLegendLabel(hidden: Set<string>, label: string): Set<string> {
  const next = new Set(hidden);
  if (next.has(label)) {
    next.delete(label);
  } else {
    next.add(label);
  }
  return next;
}

/** Remove séries ocultas (evita NaN no gráfico de pizza ao usar valor 0). */
export function applyHiddenToGroupedSeries(
  data: ChartGroupedData[],
  hidden: Set<string>,
): ChartGroupedData[] {
  if (hidden.size === 0) {
    return data;
  }
  return data.map((group) => ({
    ...group,
    series: group.series
      .filter((s) => !hidden.has(s.name))
      .map((s) => ({ ...s, value: sanitizeChartNumber(s.value) })),
  }));
}

export function applyHiddenToSingleSeries(
  data: ChartSingleData[],
  hidden: Set<string>,
): ChartSingleData[] {
  const sanitized = data.map((d) => ({
    ...d,
    value: sanitizeChartNumber(d.value),
  }));
  if (hidden.size === 0) {
    return sanitized;
  }
  return sanitized.filter((d) => !hidden.has(d.name));
}
