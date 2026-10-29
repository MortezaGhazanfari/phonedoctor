import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';
import { SITE_URL, SeoService } from '../../core/seo/seo.service';
import { GENERAL_SERVICES } from '../preise/price-data';
import { abPreisFuer, anzeigeName, modellSlug } from '../preise/geraete';
import { Faq, Problem, REPARATUR_SEITEN, ReparaturSeite, findeSeite, modelleFuer } from './reparatur-seiten';

interface ProblemMitPreis extends Problem {
  ab: number | null;
}

const LEISTUNG: Record<string, string> = {
  display: 'ein Display-Tausch',
  glas: 'ein neues Glas',
  akku: 'ein neuer Akku',
  ladebuchse: 'eine neue Ladebuchse',
  backcover: 'ein neues Rückglas',
  tastatur: 'eine neue Tastatur',
};

interface MarkenGruppe {
  marke: string;
  modelle: { name: string; slug: string }[];
}

@Component({
  selector: 'app-reparatur-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './reparatur.component.html',
  styleUrls: ['../modell/modell.component.scss'],
})
export class ReparaturComponent {
  private seo = inject(SeoService);

  contact = CONTACT_CONFIG;
  general = GENERAL_SERVICES;
  andereSeiten: ReparaturSeite[] = [];

  seite: ReparaturSeite | null = null;
  probleme: ProblemMitPreis[] = [];
  markenGruppen: MarkenGruppe[] = [];
  faqs: Faq[] = [];

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((params) => this.laden(params.get('slug') ?? ''));
  }

  private laden(slug: string): void {
    const seite = findeSeite(slug) ?? null;
    this.seite = seite;
    if (!seite) {
      this.seo.setTitle('Seite nicht gefunden – Phone Doctor Frankfurt');
      return;
    }

    const modelle = modelleFuer(seite);
    this.andereSeiten = REPARATUR_SEITEN.filter((s) => s !== seite);
    this.probleme = seite.probleme.map((p) => ({ ...p, ab: abPreisFuer(modelle, p.kategorie) }));

    const gruppen = new Map<string, MarkenGruppe>();
    for (const m of modelle) {
      if (!gruppen.has(m.brand)) gruppen.set(m.brand, { marke: m.brand, modelle: [] });
      gruppen.get(m.brand)!.modelle.push({ name: anzeigeName(m), slug: modellSlug(m) });
    }
    this.markenGruppen = [...gruppen.values()];

    const preisFaqs: Faq[] = this.probleme
      .filter((p) => p.ab !== null && LEISTUNG[p.kategorie])
      .slice(0, 3)
      .map((p) => ({
        frage: `Was kostet ${LEISTUNG[p.kategorie]} ${seite.beimGeraet}?`,
        antwort: `Bei Phone Doctor in Frankfurt ab ${p.ab} € – je nach Modell und Ersatzteil-Qualität. Den genauen Preis für dein Modell findest du in der Modellliste auf dieser Seite oder im Preisrechner.`,
      }));
    this.faqs = [...seite.faqs.slice(0, 1), ...preisFaqs, ...seite.faqs.slice(1)];

    this.seo.setTitle(seite.titel);
    this.seo.setDescription(seite.beschreibung);
    this.setzeStrukturierteDaten(seite);
  }

  private setzeStrukturierteDaten(seite: ReparaturSeite): void {
    const url = `${SITE_URL}/reparatur/${seite.slug}/`;
    this.seo.setJsonLd('reparatur-service-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: seite.h1,
      description: seite.beschreibung,
      serviceType: seite.kurzname,
      url,
      areaServed: { '@type': 'City', name: 'Frankfurt am Main' },
      provider: { '@id': `${SITE_URL}/#business` },
      offers: this.probleme
        .filter((p) => p.ab !== null)
        .map((p) => ({
          '@type': 'Offer',
          name: p.titel,
          priceSpecification: { '@type': 'PriceSpecification', minPrice: p.ab, priceCurrency: 'EUR' },
        })),
    });
    this.seo.setJsonLd('reparatur-faq-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: f.frage,
        acceptedAnswer: { '@type': 'Answer', text: f.antwort },
      })),
    });
    this.seo.setJsonLd('reparatur-breadcrumb-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: seite.kurzname, item: url },
      ],
    });
  }

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    const text = `Hallo Phone Doctor, ich möchte mein ${this.seite?.geraet ?? 'Gerät'} reparieren lassen. Modell: … Problem: …`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
}
