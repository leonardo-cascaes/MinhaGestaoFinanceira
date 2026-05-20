import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ChartLegendItem {
  label: string;
  color: string;
}

@Component({
  selector: 'app-chart-legend',
  standalone: true,
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegendComponent {
  items = input.required<ChartLegendItem[]>();
  hidden = input<ReadonlySet<string>>(new Set());

  toggle = output<string>();
}
