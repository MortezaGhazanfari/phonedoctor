import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG, telefonAnzeige } from '../../core/contact/contact.config.config';

@Component({
  selector: 'app-kontakt-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.scss']
})
export class KontaktComponent {
  contact = CONTACT_CONFIG;
  telefonAnzeige = telefonAnzeige;

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
