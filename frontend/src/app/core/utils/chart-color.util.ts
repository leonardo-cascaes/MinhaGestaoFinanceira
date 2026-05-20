/** Cor fixa por categoria — não muda ao ocultar outras no gráfico. */
const CATEGORY_CHART_COLORS: Record<string, string> = {
  Alimentação: '#f59e0b',
  Transporte: '#06b6d4',
  Moradia: '#2563eb',
  Saúde: '#8b5cf6',
  Educação: '#84cc16',
  Lazer: '#ec4899',
  Assinaturas: '#ef4444',
  Compras: '#10b981',
  Outros: '#64748b',
};

export const CHART_CATEGORY_PALETTE = Object.values(CATEGORY_CHART_COLORS);

export function colorForCategoryName(name: string, fallbackIndex = 0): string {
  const fixed = CATEGORY_CHART_COLORS[name];
  if (fixed) {
    return fixed;
  }
  const palette = CHART_CATEGORY_PALETTE;
  return palette[fallbackIndex % palette.length];
}

export interface ChartCustomColor {
  name: string;
  value: string;
}

/** Mapeia nome → cor para o ngx-charts não remapear ao filtrar séries. */
export function customColorsForCategoryNames(
  names: readonly string[],
): ChartCustomColor[] {
  return names.map((name, index) => ({
    name,
    value: colorForCategoryName(name, index),
  }));
}

export const INCOME_EXPENSE_CUSTOM_COLORS: ChartCustomColor[] = [
  { name: 'Receitas', value: '#10b981' },
  { name: 'Despesas', value: '#ef4444' },
];
