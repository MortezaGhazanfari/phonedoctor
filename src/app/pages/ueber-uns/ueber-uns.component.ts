import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';
import { SITE_URL, SeoService } from '../../core/seo/seo.service';
import { REPARATUR_SEITEN } from '../reparatur/reparatur-seiten';

@Component({
  selector: 'app-ueber-uns-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './ueber-uns.component.html',
  styleUrls: ['../modell/modell.component.scss'],
})
export class UeberUnsComponent {
  contact = CONTACT_CONFIG;
  reparaturSeiten = REPARATUR_SEITEN;

  constructor(seo: SeoService) {
    seo.setJsonLd('ueber-uns-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Über Phone Doctor Frankfurt',
      url: `${SITE_URL}/ueber-uns/`,
      mainEntity: { '@id': `${SITE_URL}/#business` },
    });
  }
}
