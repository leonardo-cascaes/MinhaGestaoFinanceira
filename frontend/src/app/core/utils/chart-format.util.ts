/** Garante número finito para escalas e rótulos do ngx-charts. */
export function sanitizeChartNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatChartCurrency(
  value: unknown,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number },
): string {
  const n = sanitizeChartNumber(value);
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  });
}

export function formatChartPercent(value: unknown, total: unknown): string {
  const v = sanitizeChartNumber(value);
  const t = sanitizeChartNumber(total);
  if (v <= 0 || t <= 0) {
    return '0,0%';
  }
  return `${((v / t) * 100).toFixed(1).replace('.', ',')}%`;
}

export interface ChartTooltipModel {
  name?: string;
  series?: string;
  value?: number;
  label?: string;
}

export function chartTooltipSeries(model: ChartTooltipModel): string | null {
  return model.series?.trim() || null;
}

export function chartTooltipCategory(model: ChartTooltipModel): string {
  return (model.name ?? model.label ?? '').trim();
}
