import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideWallet,
  LucidePiggyBank,
  LucideLandmark,
} from '@lucide/angular';
import { MonthlyBalance } from '@core/models/balance.model';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    NgClass,
    LucideTrendingUp,
    LucideTrendingDown,
    LucideWallet,
    LucidePiggyBank,
    LucideLandmark,
  ],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardsComponent {
  balance = input.required<MonthlyBalance>();
}
