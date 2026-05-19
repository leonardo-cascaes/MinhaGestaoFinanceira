import { Routes } from '@angular/router';

export const INCOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/income-list/income-list.component').then(
        (m) => m.IncomeListComponent,
      ),
  },
];
