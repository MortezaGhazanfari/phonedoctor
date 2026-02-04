import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';

@Component({
  selector: 'app-agb-page',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss']
})
export class AgbComponent {
    contact = CONTACT_CONFIG;

  get contactFormatted() {
    return {
      phone: this.formatPhone(this.contact.phone),
      mobilePhone: this.formatPhone(this.contact.mobilePhone),
      email: this.contact.email,
      address: this.contact.address,
      shopName: this.contact.shopName,
    };
  }

  private formatPhone(value: string): string {
        return value.replace('+49', '0').replace(/\s+/g, '');
  }
}
