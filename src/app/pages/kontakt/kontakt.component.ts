import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';

@Component({
  selector: 'app-kontakt-page',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.scss']
})
export class KontaktComponent {
  contact = CONTACT_CONFIG;

  constructor(meta: Meta) {
    meta.updateTag({
      name: 'description',
      content:
        'Kontakt & Öffnungszeiten von Phone Doctor Frankfurt: Borsigallee 37, 60388 Frankfurt. Telefon 06109 7196886, WhatsApp 0176 80733316, info@phonedoctorffm.de.',
    });
  }

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }

  get telFestnetzHref(): string {
    return `tel:${this.contact.phone}`;
  }

  get telMobilHref(): string {
    return `tel:${this.contact.mobilePhone}`;
  }

  get mailHref(): string {
    return `mailto:${this.contact.email}`;
  }
}
