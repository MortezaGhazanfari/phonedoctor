import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private router: Router) {}

  get whatsappHref(): string {
    const digits = (this.contact.whatsapp ?? '').replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
  }

  private get istStartseite(): boolean {
    return this.router.url.split('#')[0].split('?')[0] === '/';
  }

  scrollTo(sectionId: string): void {
    this.isMobileOpen = false;

    if (this.istStartseite) {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Von Unterseiten: zur Startseite navigieren und dort zum Abschnitt springen
    if (sectionId === 'top') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/'], { fragment: sectionId });
    }
  }
}
