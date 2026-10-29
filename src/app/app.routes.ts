import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Handy Reparatur Frankfurt – Display, Akku & mehr | Phone Doctor',
    data: {
      description:
        'Handy, iPhone, Tablet, MacBook, Laptop & Smartwatch Reparatur in Frankfurt (Borsigallee 37, am Hessen-Center). Display, Akku, Ladebuchse – schnell, fair, mit Gewährleistung.',
    },
  },

  {
    path: 'preise',
    loadComponent: () =>
      import('./pages/preise/preise.component').then(m => m.PreiseComponent),
    title: 'Reparatur-Preise & Preisrechner – Phone Doctor Frankfurt',
    data: {
      description:
        'Was kostet deine Handy-Reparatur? Gerät wählen, Schaden beschreiben und sofort den voraussichtlichen Preis sehen – für iPhone, Samsung Galaxy, iPad, MacBook und über 350 Modelle. Phone Doctor Frankfurt.',
    },
  },
  {
    path: 'preise/:modell',
    loadComponent: () =>
      import('./pages/modell/modell.component').then(m => m.ModellComponent),
  },
  {
    path: 'reparatur/:slug',
    loadComponent: () =>
      import('./pages/reparatur/reparatur.component').then(m => m.ReparaturComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then(m => m.FaqComponent),
    title: 'FAQ – Häufige Fragen zur Handy-Reparatur | Phone Doctor Frankfurt',
    data: {
      description:
        'Antworten auf häufige Fragen zur Handy-Reparatur in Frankfurt: Kosten, Dauer, Garantie, Wasserschaden, Datenerhalt und mehr – Phone Doctor, Borsigallee 37.',
    },
  },
  {
    path: 'ueber-uns',
    loadComponent: () =>
      import('./pages/ueber-uns/ueber-uns.component').then(m => m.UeberUnsComponent),
    title: 'Über uns – Phone Doctor Frankfurt, Handy-Reparatur am Hessen-Center',
    data: {
      description:
        'Phone Doctor ist eine Reparaturwerkstatt für Handys, Tablets, Laptops, MacBooks und Smartwatches in Frankfurt-Bergen-Enkheim (Borsigallee 37, am Hessen-Center). Inhaber: Morteza Ghazanfari.',
    },
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./pages/kontakt/kontakt.component').then(m => m.KontaktComponent),
    title: 'Kontakt & Öffnungszeiten – Phone Doctor Frankfurt, Borsigallee 37',
    data: {
      description:
        'Kontakt & Öffnungszeiten von Phone Doctor Frankfurt: Borsigallee 37, 60388 Frankfurt. Telefon 06109 7196886, WhatsApp 0176 80733316, info@phonedoctorffm.de.',
    },
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
