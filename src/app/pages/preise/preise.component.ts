import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';
import { DeviceModel, GENERAL_SERVICES, PRICE_DATA, PriceEntry } from './price-data';

interface Kategorie {
  id: string;
  label: string;
  keywords: string[];
}

interface Ergebnis {
  id: string;
  label: string;
  eintraege: PriceEntry[];
}

const KATEGORIEN: Kategorie[] = [
  {
    id: 'wasserschaden',
    label: 'Wasserschaden',
    keywords: ['wasser', 'nass', 'flüssigkeit', 'pool', 'meer', 'waschmaschine', 'toilette', 'regen', 'getränk'],
  },
  {
    id: 'akku',
    label: 'Akku',
    keywords: ['akku', 'batterie', 'schnell leer', 'hält nicht', 'geht schnell aus', 'aufgebläht'],
  },
  {
    id: 'ladebuchse',
    label: 'Ladebuchse',
    keywords: ['lädt nicht', 'laedt nicht', 'laden', 'ladekabel', 'ladebuchse', 'buchse', 'stecker', 'usb', 'wackelkontakt'],
  },
  {
    id: 'kameraglas',
    label: 'Kameraglas',
    keywords: ['kameraglas', 'kamera glas', 'linse'],
  },
  {
    id: 'kamera',
    label: 'Kamera',
    keywords: ['kamera', 'foto', 'unscharf', 'selfie'],
  },
  {
    id: 'backcover',
    label: 'Rückseite / Backcover',
    keywords: ['rückseite', 'rueckseite', 'backcover', 'hinten kaputt', 'rückglas', 'hinterseite'],
  },
  {
    id: 'hoermuschel',
    label: 'Hörmuschel',
    keywords: ['hörmuschel', 'hoermuschel', 'höre nichts', 'schlecht hören', 'beim telefonieren leise'],
  },
  {
    id: 'lautsprecher',
    label: 'Lautsprecher',
    keywords: ['lautsprecher', 'ton', 'leise', 'musik', 'klingelton', 'kein sound'],
  },
  {
    id: 'staubnetz',
    label: 'Staubnetz / Lautsprecher-Reinigung',
    keywords: ['staub', 'staubnetz', 'dreck im lautsprecher'],
  },
  {
    id: 'mikrofon',
    label: 'Mikrofon',
    keywords: ['mikrofon', 'mikro', 'versteht mich nicht', 'hört mich nicht'],
  },
  {
    id: 'sim',
    label: 'SIM-Kartenleser',
    keywords: ['sim'],
  },
  {
    id: 'kopfhoererbuchse',
    label: 'Kopfhörerbuchse',
    keywords: ['kopfhörer', 'kopfhoerer', 'aux'],
  },
  {
    id: 'tastatur',
    label: 'Tastatur',
    keywords: ['tastatur', 'taste'],
  },
  {
    id: 'datenrettung',
    label: 'Datenrettung',
    keywords: ['datenrettung', 'daten retten', 'fotos retten', 'daten wichtig'],
  },
  {
    id: 'glas',
    label: 'Frontglas / Touchscreen',
    keywords: ['nur glas', 'touchscreen', 'touch geht nicht', 'reagiert nicht'],
  },
  {
    id: 'display',
    label: 'Display / Bildschirm',
    keywords: ['display', 'bildschirm', 'scheibe', 'glas', 'riss', 'gesprungen', 'gebrochen', 'anzeige', 'kein bild', 'schwarzes bild', 'streifen', 'pixel', 'flecken', 'runtergefallen', 'gefallen'],
  },
  {
    id: 'komplett',
    label: 'Komplett-Tausch',
    keywords: ['komplett', 'austauschgerät', 'tauschgerät'],
  },
];

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

  suche = '';
  vorschlaege: DeviceModel[] = [];
  modell: DeviceModel | null = null;

  problem = '';
  ergebnisse: Ergebnis[] = [];
  diagnoseHinweis = false;

  constructor(meta: Meta) {
    meta.updateTag({
      name: 'description',
      content:
        'Was kostet deine Handy-Reparatur? Gerät wählen, Schaden beschreiben und sofort den voraussichtlichen Preis sehen – für iPhone, Samsung Galaxy und über 350 Modelle. Phone Doctor Frankfurt.',
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
    // Kameraglas gewinnt gegen Kamera, Glas gegen Display nur wenn beides matcht? Beide zeigen ist ehrlicher.
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
