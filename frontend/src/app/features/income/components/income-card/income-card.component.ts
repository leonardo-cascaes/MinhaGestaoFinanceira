import { Component, computed, input, output } from '@angular/core';
import { Income, IncomeType } from '@core/models/income.model';
import {
  LucideBriefcase,
  LucideLaptop,
  LucideTrendingUp,
  LucideHome,
  LucideGift,
  LucideCircleDollarSign,
  LucidePencil,
  LucideTrash2,
  LucideRepeat,
} from '@lucide/angular';

const TYPE_CONFIG: Record<IncomeType, { label: string; cssClass: string }> = {
  [IncomeType.SALARY]: { label: 'Salário', cssClass: 'salary' },
  [IncomeType.FREELANCE]: { label: 'Freelance', cssClass: 'freelance' },
  [IncomeType.INVESTMENT]: { label: 'Investimento', cssClass: 'investment' },
  [IncomeType.RENTAL]: { label: 'Aluguel', cssClass: 'rental' },
  [IncomeType.BONUS]: { label: 'Bônus', cssClass: 'bonus' },
  [IncomeType.OTHER]: { label: 'Outro', cssClass: 'other' },
};

const currencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

@Component({
  selector: 'app-income-card',
  standalone: true,
  imports: [
    LucideBriefcase,
    LucideLaptop,
    LucideTrendingUp,
    LucideHome,
    LucideGift,
    LucideCircleDollarSign,
    LucidePencil,
    LucideTrash2,
    LucideRepeat,
  ],
  templateUrl: './income-card.component.html',
  styleUrl: './income-card.component.scss',
})
export class IncomeCardComponent {
  income = input.required<Income>();
  edit = output<Income>();
  remove = output<Income>();

  readonly IncomeType = IncomeType;

  typeConfig = computed(() => TYPE_CONFIG[this.income().type]);

  formattedAmount = computed(() => currencyFmt.format(this.income().amount));

  formattedDate = computed(() => {
    const d = this.income().date;
    return dateFmt.format(d instanceof Date ? d : new Date(d));
  });
}
