import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideWallet,
  LucidePiggyBank,
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
  ],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss',
})
export class SummaryCardsComponent {
  balance = input.required<MonthlyBalance>();
}
