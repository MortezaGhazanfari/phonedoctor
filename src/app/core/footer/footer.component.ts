import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONTACT_CONFIG } from '../contact/contact.config.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  contact = CONTACT_CONFIG;
Date: any;

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
}
