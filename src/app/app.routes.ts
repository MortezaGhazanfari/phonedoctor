import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'kontakt',
    loadComponent: () =>
      import('./pages/kontakt/kontakt.component').then(m => m.KontaktComponent),
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./pages/impressum/impressum.component').then(m => m.ImpressumComponent),
  },
  {
    path: 'agb',
    loadComponent: () =>
      import('./pages/agb/agb.component').then(m => m.AgbComponent),
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./pages/datenschutz/datenschutz.component').then(m => m.DatenschutzComponent),
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
