import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG, telefonAnzeige } from '../../core/contact/contact.config.config';
import { SITE_URL, SeoService } from '../../core/seo/seo.service';
import { REPARATUR_SEITEN } from '../reparatur/reparatur-seiten';
import { ANFAHRT_LAGE, ANFAHRT_WEGE, ROUTE_APPLE, ROUTE_GOOGLE, STADTTEILE, UMLAND } from './anfahrt-daten';

@Component({
  selector: 'app-anfahrt-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './anfahrt.component.html',
  styleUrls: ['../modell/modell.component.scss'],
})
export class AnfahrtComponent {
  contact = CONTACT_CONFIG;
  telefonAnzeige = telefonAnzeige;
  reparaturSeiten = REPARATUR_SEITEN;
  lage = ANFAHRT_LAGE;
  wege = ANFAHRT_WEGE;
  stadtteile = STADTTEILE;
  umland = UMLAND;
  routeGoogle = ROUTE_GOOGLE;
  routeApple = ROUTE_APPLE;

  constructor(seo: SeoService) {
    seo.setJsonLd('anfahrt-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Anfahrt zu Phone Doctor Frankfurt',
      url: `${SITE_URL}/anfahrt/`,
      about: { '@id': `${SITE_URL}/#business` },
    });
  }
}
