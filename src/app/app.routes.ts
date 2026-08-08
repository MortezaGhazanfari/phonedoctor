import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Handy Reparatur Frankfurt – Display, Akku & mehr | Phone Doctor',
  },

  {
    path: 'preise',
    loadComponent: () =>
      import('./pages/preise/preise.component').then(m => m.PreiseComponent),
    title: 'Reparatur-Preise & Preisrechner – Phone Doctor Frankfurt',
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then(m => m.FaqComponent),
    title: 'FAQ – Häufige Fragen zur Handy-Reparatur | Phone Doctor Frankfurt',
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./pages/kontakt/kontakt.component').then(m => m.KontaktComponent),
    title: 'Kontakt & Öffnungszeiten – Phone Doctor Frankfurt, Borsigallee 37',
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./pages/impressum/impressum.component').then(m => m.ImpressumComponent),
    title: 'Impressum – Phone Doctor Frankfurt',
  },
  {
    path: 'agb',
    loadComponent: () =>
      import('./pages/agb/agb.component').then(m => m.AgbComponent),
    title: 'AGB – Phone Doctor Frankfurt',
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./pages/datenschutz/datenschutz.component').then(m => m.DatenschutzComponent),
    title: 'Datenschutzerklärung – Phone Doctor Frankfurt',
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
