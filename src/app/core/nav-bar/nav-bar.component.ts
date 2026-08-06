import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CONTACT_CONFIG } from '../contact/contact.config.config';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  contact = CONTACT_CONFIG;
  isMobileOpen = false;

  get whatsappHref(): string {
    const digits = (this.contact.whatsapp ?? '').replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isMobileOpen = false;
    }
  }
}
