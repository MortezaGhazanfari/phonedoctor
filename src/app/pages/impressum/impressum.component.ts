import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';

@Component({
  selector: 'app-impressum-page',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss']
})
export class ImpressumComponent {
  contact = CONTACT_CONFIG;
   get contactFormatted() {
    return {
      phone: this.formatPhone(this.contact.phone),
      mobilePhone: this.formatPhone(this.contact.mobilePhone),
      email: this.contact.email,
    };
  }

  private formatPhone(value: string): string {
    return value.replace(/\s+/g, '');
  } 
}
