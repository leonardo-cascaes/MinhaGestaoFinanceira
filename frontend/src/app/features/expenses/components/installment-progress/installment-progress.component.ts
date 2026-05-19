import { Component, computed, input } from '@angular/core';
import { InstallmentInfo } from '@core/models/expense.model';

const currencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

@Component({
  selector: 'app-installment-progress',
  standalone: true,
  template: `
    <div class="inst-progress">
      <div class="inst-progress__header">
        <span class="inst-progress__label">
          Parcela {{ currentForMonth() }}/{{ effectiveTotal() }}
        </span>
        <span class="inst-progress__percent">{{ percentText() }}</span>
      </div>
      <div class="inst-progress__bar">
        <div class="inst-progress__fill" [style.width.%]="percent()"></div>
      </div>
      @if (installment().advancePayment) {
        <span class="inst-progress__advance">
          {{ installment().advancePayment!.installmentsAdvanced }} parcelas adiantadas
          ({{ formattedDiscount() }} de desconto)
        </span>
      }
    </div>
  `,
  styles: `
    .inst-progress {
      width: 100%;

      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      &__label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--color-text-muted);
      }

      &__percent {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--color-primary);
      }

      &__bar {
        height: 6px;
        background: var(--color-border);
        border-radius: 3px;
        overflow: hidden;
      }

      &__fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      &__advance {
        display: block;
        margin-top: 4px;
        font-size: 0.7rem;
        color: var(--color-success);
        font-weight: 500;
      }
    }
  `,
})
export class InstallmentProgressComponent {
  installment = input.required<InstallmentInfo>();
  month = input.required<number>();
  year = input.required<number>();

  effectiveTotal = computed(() => {
    const inst = this.installment();
    if (inst.advancePayment) {
      return inst.totalInstallments - inst.advancePayment.installmentsAdvanced;
    }
    return inst.totalInstallments;
  });

  currentForMonth = computed(() => {
    const inst = this.installment();
    const target = this.year() * 12 + this.month();
    const start = inst.startYear * 12 + inst.startMonth;
    return Math.min(target - start + 1, this.effectiveTotal());
  });

  percent = computed(() => {
    const total = this.effectiveTotal();
    if (total === 0) return 100;
    return Math.round((this.currentForMonth() / total) * 100);
  });

  percentText = computed(() => `${this.percent()}%`);

  formattedDiscount = computed(() => {
    const adv = this.installment().advancePayment;
    return adv ? currencyFmt.format(adv.discount) : '';
  });
}
