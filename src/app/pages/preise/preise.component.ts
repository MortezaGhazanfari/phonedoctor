import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';
import { SITE_URL, SeoService } from '../../core/seo/seo.service';
import { DeviceModel, GENERAL_SERVICES, PRICE_DATA, PriceEntry } from './price-data';
import { KATEGORIEN, Kategorie } from './reparatur-kategorien';
import { abPreis, abPreisFuer, anzeigeName, modellSlug } from './geraete';
import { REPARATUR_SEITEN } from '../reparatur/reparatur-seiten';

interface Ergebnis {
  id: string;
  label: string;
  eintraege: PriceEntry[];
}

interface ListenZeile {
  name: string;
  slug: string;
  display: number | null;
  akku: number | null;
  ladebuchse: number | null;
}

const DIAGNOSE_KEYWORDS = ['geht nicht an', 'geht nicht mehr an', 'startet nicht', 'bleibt aus', 'ist tot', 'keine reaktion', 'weiß nicht', 'weiss nicht', 'keine ahnung'];

@Component({
  selector: 'app-preise-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './preise.component.html',
  styleUrls: ['./preise.component.scss'],
})
export class PreiseComponent {
  contact = CONTACT_CONFIG;
  general = GENERAL_SERVICES;
  reparaturSeiten = REPARATUR_SEITEN;

  preisliste: { brand: string; zeilen: ListenZeile[] }[] = [];

  suche = '';
  vorschlaege: DeviceModel[] = [];
  modell: DeviceModel | null = null;

  problem = '';
  ergebnisse: Ergebnis[] = [];
  diagnoseHinweis = false;

  constructor(seo: SeoService) {
    const marken = ['Apple', 'Samsung', 'Google', 'Huawei', 'Sony', 'Microsoft'];
    this.preisliste = marken
      .map((b) => ({
        brand: b,
        zeilen: PRICE_DATA.filter((m) => m.brand === b).map((m) => ({
          name: anzeigeName(m),
          slug: modellSlug(m),
          display: abPreis(m.repairs['display']),
          akku: abPreis(m.repairs['akku']),
          ladebuchse: abPreis(m.repairs['ladebuchse']),
        })),
      }))
      .filter((g) => g.zeilen.length > 0);

    const angebote = [
      { name: 'Display-Reparatur', cat: 'display' },
      { name: 'Akku-Tausch', cat: 'akku' },
      { name: 'Ladebuchsen-Reparatur', cat: 'ladebuchse' },
      { name: 'Kamera-Reparatur', cat: 'kamera' },
      { name: 'Backcover-Tausch', cat: 'backcover' },
    ]
      .map((a) => ({ ...a, min: abPreisFuer(PRICE_DATA, a.cat) }))
      .filter((a) => a.min !== null)
      .map((a) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: `${a.name} (Smartphone/Tablet)`, areaServed: 'Frankfurt am Main' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: a.min,
          priceCurrency: 'EUR',
        },
      }));
    seo.setJsonLd('preise-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Reparatur-Preise Phone Doctor Frankfurt',
      url: `${SITE_URL}/preise/`,
      itemListElement: angebote,
    });
  }

  sucheGeaendert(wert: string): void {
    this.suche = wert;
    this.modell = null;
    this.ergebnisse = [];
    const tokens = wert.toLowerCase().split(/\s+/).filter((t) => t.length > 0);
    if (tokens.length === 0 || wert.trim().length < 2) {
      this.vorschlaege = [];
      return;
    }
    this.vorschlaege = PRICE_DATA.filter((m) => {
      const voll = (m.brand + ' ' + m.name).toLowerCase();
      return tokens.every((t) => voll.includes(t));
    }).slice(0, 8);
  }

  waehleModell(m: DeviceModel): void {
    this.modell = m;
    this.suche = m.name;
    this.vorschlaege = [];
    this.analysiere();
  }

  resetModell(): void {
    this.modell = null;
    this.suche = '';
    this.ergebnisse = [];
    this.problem = '';
  }

  get verfuegbareKategorien(): Kategorie[] {
    if (!this.modell) return [];
    return KATEGORIEN.filter((k) => this.modell!.repairs[k.id]?.length);
  }

  analysiere(): void {
    this.diagnoseHinweis = false;
    this.ergebnisse = [];
    if (!this.modell) return;
    const text = this.problem.toLowerCase();
    if (text.trim().length < 3) return;

    if (DIAGNOSE_KEYWORDS.some((k) => text.includes(k))) {
      this.diagnoseHinweis = true;
    }

    const treffer: Ergebnis[] = [];
    for (const k of KATEGORIEN) {
      if (!this.modell.repairs[k.id]?.length) continue;
      if (k.keywords.some((w) => text.includes(w))) {
        treffer.push({ id: k.id, label: k.label, eintraege: this.modell.repairs[k.id] });
      }
    }
    this.ergebnisse = treffer;
    if (treffer.length === 0 && !this.diagnoseHinweis) {
      this.diagnoseHinweis = true;
    }
  }

  waehleKategorie(id: string): void {
    if (!this.modell) return;
    const k = KATEGORIEN.find((x) => x.id === id);
    if (!k) return;
    this.diagnoseHinweis = false;
    this.problem = k.label;
    this.ergebnisse = [{ id: k.id, label: k.label, eintraege: this.modell.repairs[k.id] }];
  }

  istAktiv(id: string): boolean {
    return this.ergebnisse.some((e) => e.id === id);
  }

  get guenstigsterPreis(): number | null {
    const preise = this.ergebnisse.flatMap((e) => e.eintraege.map((x) => x.p));
    return preise.length ? Math.min(...preise) : null;
  }

  get nachrichtText(): string {
    const geraet = this.modell ? `${this.modell.brand} ${this.modell.name}` : this.suche.trim();
    const intro = geraet ? `ich habe ein ${geraet}` : `mein Gerät hat ein Problem`;
    const schaden = this.problem ? ` Folgendes ist kaputt: ${this.problem}.` : '';
    return `Hallo Phone Doctor, ${intro}.${schaden} Was würde die Reparatur kosten?`;
  }

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(this.nachrichtText)}`;
  }

  get mailHref(): string {
    return `mailto:${this.contact.email}?subject=${encodeURIComponent('Reparatur-Anfrage')}&body=${encodeURIComponent(this.nachrichtText)}`;
  }

  get telHref(): string {
    return `tel:${this.contact.phone}`;
  }
}
