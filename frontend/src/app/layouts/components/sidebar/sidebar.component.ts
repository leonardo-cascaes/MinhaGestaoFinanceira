import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLayoutDashboard, LucideTrendingUp, LucideCreditCard } from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideLayoutDashboard, LucideTrendingUp, LucideCreditCard],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  collapsed = input(false);
  mobileOpen = input(false);
  closeMobile = output<void>();

  onNavClick(): void {
    this.closeMobile.emit();
  }
}
