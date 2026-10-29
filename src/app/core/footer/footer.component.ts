import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CONTACT_CONFIG } from '../contact/contact.config.config';
import { REPARATUR_SEITEN } from '../../pages/reparatur/reparatur-seiten';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  contact = CONTACT_CONFIG;
  reparaturSeiten = REPARATUR_SEITEN;
  jahr = new Date().getFullYear();

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
}
