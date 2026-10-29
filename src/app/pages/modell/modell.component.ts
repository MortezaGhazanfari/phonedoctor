import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';
import { SITE_URL, SeoService } from '../../core/seo/seo.service';
import { DeviceModel, GENERAL_SERVICES, PRICE_DATA, PriceEntry } from '../preise/price-data';
import { KATEGORIEN } from '../preise/reparatur-kategorien';
import { abPreis, anzeigeName, findeModell, modellSlug } from '../preise/geraete';
import { Faq, ReparaturSeite, seiteFuerModell } from '../reparatur/reparatur-seiten';

interface Reparatur {
  id: string;
  label: string;
  ab: number;
  eintraege: PriceEntry[];
}

interface Verwandt {
  name: string;
  slug: string;
}

/** Reihenfolge nach Häufigkeit der Kundenanfragen; nicht gelistete Reparaturen folgen danach. */
const REIHENFOLGE = ['display', 'glas', 'akku', 'ladebuchse', 'backcover', 'tastatur', 'kamera', 'kameraglas', 'wasserschaden', 'datenrettung'];

function qualitaetLabel(q: string): string {
  if (!q) return 'Austausch / Reparatur';
  if (q === 'ab') return 'Preis ab';
  return q;
}

@Component({
  selector: 'app-modell-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './modell.component.html',
  styleUrls: ['./modell.component.scss'],
})
export class ModellComponent {
  private seo = inject(SeoService);

  contact = CONTACT_CONFIG;
  general = GENERAL_SERVICES;
  qualitaetLabel = qualitaetLabel;

  modell: DeviceModel | null = null;
  name = '';
  reparaturen: Reparatur[] = [];
  seite: ReparaturSeite | null = null;
  verwandte: Verwandt[] = [];
  faqs: Faq[] = [];

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((params) => this.laden(params.get('modell') ?? ''));
  }

  private laden(slug: string): void {
    const m = findeModell(slug) ?? null;
    this.modell = m;
    if (!m) {
      this.seo.setTitle('Modell nicht gefunden – Phone Doctor Frankfurt');
      return;
    }

    this.name = anzeigeName(m);
    this.seite = seiteFuerModell(m);
    const rang = (id: string) => (REIHENFOLGE.indexOf(id) === -1 ? REIHENFOLGE.length : REIHENFOLGE.indexOf(id));
    this.reparaturen = KATEGORIEN.filter((k) => m.repairs[k.id]?.length)
      .sort((a, b) => rang(a.id) - rang(b.id))
      .map((k) => ({
        id: k.id,
        label: k.label,
        ab: abPreis(m.repairs[k.id])!,
        eintraege: m.repairs[k.id],
      }));

    const gleicheMarke = PRICE_DATA.filter((x) => x.brand === m.brand && x !== m && seiteFuerModell(x) === this.seite);
    const idx = PRICE_DATA.indexOf(m);
    this.verwandte = gleicheMarke
      .sort((a, b) => Math.abs(PRICE_DATA.indexOf(a) - idx) - Math.abs(PRICE_DATA.indexOf(b) - idx))
      .slice(0, 8)
      .map((x) => ({ name: anzeigeName(x), slug: modellSlug(x) }));

    this.faqs = this.erstelleFaqs();

    const display = abPreis(m.repairs['display']);
    const akku = abPreis(m.repairs['akku']);
    const teile = [
      display !== null ? `Display ab ${display} €` : '',
      akku !== null ? `Akku ab ${akku} €` : '',
    ].filter(Boolean);
    this.seo.setTitle(`${this.name} Reparatur Frankfurt – ${teile.length ? teile.join(', ') : 'Preise'} | Phone Doctor`);
    this.seo.setDescription(
      `${this.name} kaputt? Reparatur in Frankfurt (Borsigallee 37): ${this.reparaturen
        .slice(0, 4)
        .map((r) => `${r.label} ab ${r.ab} €`)
        .join(', ')}. Unverbindliche Richtpreise, oft am selben Tag fertig.`,
    );
    this.setzeStrukturierteDaten(slug);
  }

  private erstelleFaqs(): Faq[] {
    const faqs: Faq[] = [];
    const preisText = (r: Reparatur) =>
      r.eintraege.length > 1
        ? r.eintraege.map((e) => `${qualitaetLabel(e.q)}: ca. ${e.p} €`).join(', ')
        : `ca. ${r.ab} €`;
    const display = this.reparaturen.find((r) => r.id === 'display');
    if (display) {
      faqs.push({
        frage: `Was kostet eine Display-Reparatur beim ${this.name}?`,
        antwort: `Bei Phone Doctor in Frankfurt kostet der Display-Tausch für das ${this.name} ab ${display.ab} € (${preisText(display)}). Der genaue Preis wird vor der Reparatur bestätigt.`,
      });
    }
    const akku = this.reparaturen.find((r) => r.id === 'akku');
    if (akku) {
      faqs.push({
        frage: `Was kostet ein neuer Akku für das ${this.name}?`,
        antwort: `Der Akku-Tausch für das ${this.name} kostet bei uns ab ${akku.ab} € (${preisText(akku)}).`,
      });
    }
    faqs.push({
      frage: `Wo kann ich mein ${this.name} in Frankfurt reparieren lassen?`,
      antwort: `Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main (Bergen-Enkheim, am Hessen-Center). Du kannst ohne Termin vorbeikommen: Mo–Fr 09:30–17:30 Uhr, Sa 11:00–17:00 Uhr.`,
    });
    faqs.push({
      frage: `Wie lange dauert die Reparatur meines ${this.name}?`,
      antwort:
        'Display- und Akku-Tausch sind bei vorrätigen Teilen meist in 30 bis 90 Minuten erledigt. Frag am besten kurz per WhatsApp nach, ob dein Ersatzteil da ist.',
    });
    return faqs;
  }

  private setzeStrukturierteDaten(slug: string): void {
    const url = `${SITE_URL}/preise/${slug}/`;
    this.seo.setJsonLd('modell-service-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${this.name} Reparatur`,
      serviceType: 'Reparatur',
      url,
      areaServed: { '@type': 'City', name: 'Frankfurt am Main' },
      provider: { '@id': `${SITE_URL}/#business` },
      offers: this.reparaturen.flatMap((r) =>
        r.eintraege.map((e) => ({
          '@type': 'Offer',
          name: `${this.name} ${r.label}${e.q && e.q !== 'ab' ? ` (${e.q})` : ''}`,
          price: e.p,
          priceCurrency: 'EUR',
        })),
      ),
    });
    this.seo.setJsonLd('modell-faq-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: f.frage,
        acceptedAnswer: { '@type': 'Answer', text: f.antwort },
      })),
    });
    this.seo.setJsonLd('modell-breadcrumb-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: this.seite!.kurzname, item: `${SITE_URL}/reparatur/${this.seite!.slug}/` },
        { '@type': 'ListItem', position: 3, name: this.name, item: url },
      ],
    });
  }

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    const text = `Hallo Phone Doctor, ich habe ein ${this.name}. Was würde die Reparatur kosten?`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
}
