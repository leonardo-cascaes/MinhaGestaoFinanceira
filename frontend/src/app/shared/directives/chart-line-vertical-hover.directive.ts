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
 * Destaque vertical (linha + bolinha) ao mover o mouse na faixa do mês.
 * Usa rAF e cache de rects para evitar trabalho a cada pixel.
 */
@Directive({
  selector: '.chart-container[data-chart-line-hover]',
  standalone: true,
})
export class ChartLineVerticalHoverDirective {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private cachedRects: SVGRectElement[] | null = null;
  private lastClosest: SVGRectElement | null = null;
  private rafId: number | null = null;
  private pendingEvent: MouseEvent | null = null;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.bindMouseMove();
    });
  }

  private bindMouseMove(): void {
    const getRects = (): SVGRectElement[] => {
      if (!this.cachedRects?.length) {
        this.cachedRects = Array.from(
          this.host.querySelectorAll('.line-chart .tooltip-area rect'),
        ) as SVGRectElement[];
      }
      return this.cachedRects;
    };

    const invalidateCache = (): void => {
      this.cachedRects = null;
      this.lastClosest = null;
    };

    const flushHover = (): void => {
      this.rafId = null;
      const event = this.pendingEvent;
      this.pendingEvent = null;
      if (!event) {
        return;
      }

      const rects = getRects();
      if (!rects.length) {
        return;
      }

      let closest: SVGRectElement | null = null;
      let minDistance = Infinity;

      for (const rect of rects) {
        const box = rect.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const distance = Math.abs(event.clientX - centerX);
        if (distance < minDistance) {
          minDistance = distance;
          closest = rect;
        }
      }

      if (!closest || closest === this.lastClosest) {
        return;
      }

      this.lastClosest = closest;
      const init = {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      closest.dispatchEvent(new MouseEvent('mouseenter', init));
      closest.dispatchEvent(new MouseEvent('mousemove', init));
    };

    const onMouseMove = (event: MouseEvent): void => {
      this.pendingEvent = event;
      if (this.rafId != null) {
        return;
      }
      this.rafId = requestAnimationFrame(flushHover);
    };

    const onMouseLeave = (): void => {
      if (this.rafId != null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.pendingEvent = null;
      this.lastClosest = null;
      this.host.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    };

    this.host.addEventListener('mousemove', onMouseMove, { passive: true });
    this.host.addEventListener('mouseleave', onMouseLeave);

    const resizeObserver = new ResizeObserver(invalidateCache);
    resizeObserver.observe(this.host);

    this.destroyRef.onDestroy(() => {
      this.host.removeEventListener('mousemove', onMouseMove);
      this.host.removeEventListener('mouseleave', onMouseLeave);
      resizeObserver.disconnect();
      if (this.rafId != null) {
        cancelAnimationFrame(this.rafId);
      }
    });
  }
}
