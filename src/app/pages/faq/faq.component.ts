import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { FAQS } from './faq-daten';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  contact = CONTACT_CONFIG;

  faqs = FAQS;

  constructor(seo: SeoService) {
    seo.setJsonLd('faq-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: f.frage,
        acceptedAnswer: { '@type': 'Answer', text: f.antwort },
      })),
    });
  }

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
}
