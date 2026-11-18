import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG, telefonAnzeige } from '../../core/contact/contact.config.config';
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
  info: string;
}

interface Verwandt {
  name: string;
  slug: string;
}

/** Reihenfolge nach Häufigkeit der Kundenanfragen; nicht gelistete Reparaturen folgen danach. */
const REIHENFOLGE = ['display', 'glas', 'akku', 'ladebuchse', 'backcover', 'tastatur', 'kamera', 'kameraglas', 'wasserschaden', 'datenrettung'];

/** Kurze Erklärung je Reparaturart, damit Kunden (und Suchmaschinen) wissen, was gemacht wird. */
const REPARATUR_INFO: Record<string, string> = {
  display: 'Wir tauschen die komplette Displayeinheit aus Glas, Bildschirm und Touch – bei Rissen, Streifen, schwarzem Bild oder wenn der Touch nicht reagiert.',
  glas: 'Ist nur das Glas gesprungen und das Bild darunter in Ordnung, tauschen wir nur das Frontglas – oft günstiger als ein ganzes Display.',
  akku: 'Neuer Akku, wenn dein Gerät schnell leer ist, sich plötzlich ausschaltet oder der Akku aufgebläht ist.',
  ladebuchse: 'Lädt das Gerät nur noch mit Wackeln oder gar nicht mehr? Oft reicht eine Reinigung, sonst tauschen wir die Ladebuchse.',
  backcover: 'Gesprungene Rückseite? Wir ersetzen das Rückglas bzw. Backcover, damit kein Staub und keine Feuchtigkeit eindringen.',
  kameraglas: 'Splitter im Kameraglas führen zu unscharfen Fotos – wir tauschen das Schutzglas der Kamera.',
  kamera: 'Unscharfe, flackernde oder schwarze Kamera? Wir tauschen das Kameramodul.',
  hoermuschel: 'Hörst du beim Telefonieren nichts oder nur leise? Dann tauschen wir die Hörmuschel.',
  lautsprecher: 'Kein Ton beim Klingeln oder bei Musik? Wir prüfen und tauschen den Lautsprecher.',
  staubnetz: 'Leiser oder kratziger Ton durch Schmutz: Wir reinigen den Lautsprecher und tauschen das Staubnetz.',
  mikrofon: 'Dein Gesprächspartner versteht dich nicht? Wir tauschen das Mikrofon.',
  sim: 'SIM-Karte wird nicht erkannt? Wir tauschen den SIM-Kartenleser.',
  kopfhoererbuchse: 'Kopfhörer werden nicht erkannt oder knacken? Wir tauschen die Kopfhörerbuchse.',
  tastatur: 'Klemmende oder ausgefallene Tasten: Wir tauschen die Tastatur.',
  datenrettung: 'Gerät defekt, aber die Fotos und Daten sind wichtig? Wir versuchen, sie zu retten.',
  wasserschaden: 'Wir öffnen, reinigen und trocknen das Gerät und prüfen, was noch zu retten ist. Bei Wasserschäden gibt es keine Garantie auf die dauerhafte Funktion.',
  komplett: 'Lohnt sich keine Einzelreparatur, tauschen wir die komplette Einheit.',
};

/** Erklärung der Qualitätsstufen, wenn ein Modell mehrere anbietet. */
const QUALITAET_INFO: Record<string, string> = {
  'Standard-Qualität': 'die günstigste Option mit einem Nachbau-Ersatzteil – gut, wenn das Gerät einfach wieder funktionieren soll.',
  'Premium-Qualität': 'ein hochwertiges Ersatzteil, das in Farben, Helligkeit und Akkulaufzeit näher am Original liegt.',
  Refurbished: 'ein aufbereitetes Original-Ersatzteil – Originalqualität zu einem niedrigeren Preis.',
  Originalteil: 'ein Original-Ersatzteil des Herstellers – die beste Qualität.',
};

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
  telefonAnzeige = telefonAnzeige;
  general = GENERAL_SERVICES;
  qualitaetLabel = qualitaetLabel;

  modell: DeviceModel | null = null;
  name = '';
  reparaturen: Reparatur[] = [];
  seite: ReparaturSeite | null = null;
  verwandte: Verwandt[] = [];
  faqs: Faq[] = [];
  qualitaeten: { name: string; text: string }[] = [];

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
        info: REPARATUR_INFO[k.id] ?? '',
      }));

    const stufen = new Set(this.reparaturen.flatMap((r) => r.eintraege.map((e) => e.q)));
    this.qualitaeten = Object.keys(QUALITAET_INFO)
      .filter((q) => stufen.has(q))
      .map((q) => ({ name: q, text: QUALITAET_INFO[q] }));

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
        .join(', ')}. 6 Monate Garantie, Daten bleiben erhalten, oft am selben Tag fertig.`,
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
    for (const id of ['ladebuchse', 'backcover']) {
      const r = this.reparaturen.find((x) => x.id === id);
      if (r) {
        faqs.push({
          frage: `Was kostet ${id === 'ladebuchse' ? 'die Ladebuchse-Reparatur' : 'eine neue Rückseite'} beim ${this.name}?`,
          antwort: `Bei Phone Doctor in Frankfurt kostet das ab ${r.ab} € (${preisText(r)}).`,
        });
      }
    }
    faqs.push({
      frage: `Bekomme ich Garantie auf die ${this.name} Reparatur?`,
      antwort:
        'Ja, auf jede Reparatur gibt es 6 Monate Garantie auf das Ersatzteil und unsere Arbeit – außer bei Wasserschäden. Deine gesetzlichen Gewährleistungsrechte bleiben davon unberührt.',
    });
    faqs.push({
      frage: `Bleiben meine Daten auf dem ${this.name} erhalten?`,
      antwort:
        'In der Regel ja: Wir setzen dein Gerät nicht zurück, Fotos, Apps und Nachrichten bleiben auf dem Gerät. Ein Backup vorab empfehlen wir trotzdem.',
    });
    faqs.push({
      frage: `Wo kann ich mein ${this.name} in Frankfurt reparieren lassen?`,
      antwort: `Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main (Bergen-Enkheim, gegenüber dem Hessen-Center). Du kannst ohne Termin vorbeikommen: Mo–Fr 09:30–17:30 Uhr, Sa 11:00–17:00 Uhr.`,
    });
    faqs.push({
      frage: `Wie lange dauert die Reparatur meines ${this.name}?`,
      antwort:
        'Display- und Akku-Tausch sind bei vorrätigen Teilen meist in 30 bis 90 Minuten erledigt – du kannst warten und musst dein Handy nicht einschicken. Frag am besten kurz per WhatsApp nach, ob dein Ersatzteil da ist.',
    });
    faqs.push({
      frage: 'Macht ihr auch Kostenvoranschläge für die Handyversicherung?',
      antwort: `Ja. Ist dein ${this.name} versichert, erstellen wir dir einen Kostenvoranschlag für deine Handyversicherung.`,
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
