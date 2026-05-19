import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'receitas',
        loadChildren: () =>
          import('./features/income/income.routes').then(m => m.INCOME_ROUTES),
      },
      {
        path: 'despesas',
        loadChildren: () =>
          import('./features/expenses/expenses.routes').then(m => m.EXPENSES_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
