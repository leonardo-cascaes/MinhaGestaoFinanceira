import { Routes } from '@angular/router';

export const EXPENSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/expenses-list/expenses-list.component').then(
        (m) => m.ExpensesListComponent,
      ),
  },
];
