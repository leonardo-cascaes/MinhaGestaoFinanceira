import { Component, output } from '@angular/core';
import { LucideMenu } from '@lucide/angular';
import { MonthSelectorComponent } from '../../../shared/components/month-selector/month-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideMenu, MonthSelectorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  toggleSidebar = output<void>();
}
