import { Component, computed, input } from '@angular/core';
import { SubscriptionInfo } from '@core/models/expense.model';

@Component({
  selector: 'app-subscription-badge',
  standalone: true,
  template: `
    <span class="sub-badge" [class]="'sub-badge sub-badge--' + status().cssClass">
      {{ status().label }}
    </span>
  `,
  styles: `
    .sub-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 500;
      white-space: nowrap;

      &--active {
        background: #d1fae5;
        color: #065f46;
      }

      &--cancelled {
        background: #fef2f2;
        color: #991b1b;
      }

      &--temporary {
        background: #fef3c7;
        color: #92400e;
      }
    }
  `,
})
export class SubscriptionBadgeComponent {
  subscription = input.required<SubscriptionInfo>();

  status = computed(() => {
    const sub = this.subscription();

    if (sub.cancelledAt) {
      return { label: 'Cancelada', cssClass: 'cancelled' };
    }

    if (sub.isFixed) {
      return { label: 'Fixa', cssClass: 'active' };
    }

    return { label: 'Temporária', cssClass: 'temporary' };
  });
}
