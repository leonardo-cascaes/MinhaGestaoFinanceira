import {
  Directive,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Em telas touch, simula hover (mouseenter/mousemove) e evita que o clique
 * do ngx-tooltip esconda o tooltip imediatamente.
 */
@Directive({
  selector: '.chart-container[data-chart-tooltips]',
  standalone: true,
})
export class ChartTouchTooltipsDirective {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      if (!this.isCoarsePointer()) {
        return;
      }
      this.bindTouchHandlers();
    });
  }

  private isCoarsePointer(): boolean {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  private bindTouchHandlers(): void {
    const dispatchHover = (touch: Touch) => {
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!target || !this.host.contains(target)) {
        return;
      }

      target.dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true, cancelable: true }),
      );
      target.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
        }),
      );
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        dispatchHover(touch);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        dispatchHover(touch);
      }
    };

    const onTouchEnd = () => {
      this.host.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    };

    const onClickCapture = (event: Event) => {
      event.stopPropagation();
    };

    this.host.addEventListener('touchstart', onTouchStart, { passive: true });
    this.host.addEventListener('touchmove', onTouchMove, { passive: true });
    this.host.addEventListener('touchend', onTouchEnd, { passive: true });
    this.host.addEventListener('click', onClickCapture, true);

    this.destroyRef.onDestroy(() => {
      this.host.removeEventListener('touchstart', onTouchStart);
      this.host.removeEventListener('touchmove', onTouchMove);
      this.host.removeEventListener('touchend', onTouchEnd);
      this.host.removeEventListener('click', onClickCapture, true);
    });
  }
}
