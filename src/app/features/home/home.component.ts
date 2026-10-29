import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from "../../core/footer/footer.component";
import { SeoService } from '../../core/seo/seo.service';
import { FAQS } from '../../pages/faq/faq-daten';

const STARTSEITEN_FRAGEN = ['Welche Geräte repariert ihr?', 'Wie lange dauert eine Display- oder Akku-Reparatur?', 'Brauche ich einen Termin?', 'Bekomme ich Garantie auf die Reparatur?'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly contact = CONTACT_CONFIG;
  readonly faqs = FAQS.filter((f) => STARTSEITEN_FRAGEN.includes(f.frage));

  // Slider für Bildvergleich
  compareValue = 50;

  // Modal-State
  isModalOpen = false;
  modalStep: 1 | 2 = 1;
  currentDeviceKey = '';
  currentDeviceLabel = '';

  // Problem-Optionen pro Gerätekategorie
  readonly problemOptions: Record<string, string[]> = {
    smartphone: [
      'Display / Glasbruch',
      'Akku schnell leer',
      'Ladebuchse / lädt nicht',
      'Backcover gebrochen',
      'Kamera',
      'Mikrofon / Lautsprecher',
      'Wasserschaden',
      'Knopf defekt',
      'Kein Netz / Empfang',
      'Software-Problem',
      'Startet nicht',
    ],
    smartwatch: [
      'Display',
      'Akku',
      'Software',
      'Lädt nicht',
      'Knopf defekt',
      'Kein Vibrieren / Motor',
      'Wasserschaden',
      'startet nicht',
    ],
    tablet: [
      'Display / Glasbruch',
      'Akku',
      'Ladebuchse',
      'WLAN / Verbindung',
      'Knopf defekt',
      'Speicher / Performance',
      'Wasserschaden',
      'Lautsprecher / Audio',
      'Kamera',
      'Startet nicht',
    ],
    notebook: [
      'Startet nicht',
      'Display',
      'Tastatur',
      'Akku / Netzteil',
      'Windows / macOS Problem',
      'Wasserschaden',
      'Lautsprecher / Audio',
    ],
    escooter: [
      'Akku',
      'Motor / Controller',
      'Bremsen',
      'Licht / Elektrik',
      'Reifen / Mechanik',
    ],
    saugroboter: [
      'Akku',
      'Räder blockiert',
      'Sensorfehler',
      'Lädt nicht',
      'Saugleistung schwach',
      'Startet nicht',
    ],
    tv: [
      'Kein Bild',
      'Kein Ton',
      'Streifen / Flecken im Bild',
      'Geht nicht an',
      'HDMI / Eingang defekt',
      'Wasserschaden',
      'Startet nicht',
    ],
    konsole: [
      'Kein Bild / HDMI',
      'Überhitzung',
      'Laufwerk / Disc liest nicht',
      'Controller-Verbindung',
      'Speicher / Software',
      'Startet nicht',
    ],
    boxen: [
      'Kein Ton',
      'Verzerrter Sound',
      'Bluetooth-Probleme',
      'Akku / Stromversorgung',
      'Knacken / Rauschen',
    ],
    zubehoer: [
      'Kopfhörer / AirPods kein Ton',
      'Ladecase lädt nicht',
      'Nur ein Ohrhörer geht',
      'Bluetooth-Verbindungsprobleme',
      'Stecker / Kabel defekt',
    ],
    default: [
      'Unbekanntes Problem',
      'Gerät startet nicht',
      'Fehlermeldung wird angezeigt',
    ],
  };

  selectedProblems = new Set<string>();
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, seo: SeoService) {
    seo.setJsonLd('startseite-faq-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: f.frage,
        acceptedAnswer: { '@type': 'Answer', text: f.antwort },
      })),
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      deviceModel: ['', Validators.required],
      description: [''],
      preferredChannel: ['whatsapp', Validators.required], // 'whatsapp' | 'email'
    });
  }

  // --- Helper-URLs ---

  get whatsappHref(): string {
    const digits = (this.contact.whatsapp ?? '').replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }

  get phoneUrl(): string {
    return `tel:${this.contact.phone}`;
  }
  get mobilephoneUrl(): string {
    return `tel:${this.contact.mobilePhone}`;
  }
  get emailAddress(): string {
    return this.contact.email;
  }

  // --- Bild-Slider ---

  get clipPath(): string {
    return `inset(0 ${100 - this.compareValue}% 0 0)`;
  }

  onSlider(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.compareValue = Number(input.value);
  }

  // --- Scroll ---

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Modal-Logik ---

  openRequestModal(deviceKey: string, deviceLabel: string): void {
    this.currentDeviceKey = deviceKey;
    this.currentDeviceLabel = deviceLabel;
    this.modalStep = 1;
    this.isModalOpen = true;
    this.selectedProblems.clear();
    this.contactForm.reset({
      preferredChannel: 'whatsapp',
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  toggleProblem(problem: string): void {
    if (this.selectedProblems.has(problem)) {
      this.selectedProblems.delete(problem);
    } else {
      this.selectedProblems.add(problem);
    }
  }

  isProblemSelected(problem: string): boolean {
    return this.selectedProblems.has(problem);
  }

  goToStep2(): void {
    this.modalStep = 2;
  }

  backToStep1(): void {
    this.modalStep = 1;
  }

  get currentProblemList(): string[] {
    return (
      this.problemOptions[this.currentDeviceKey] ??
      this.problemOptions['default']
    );
  }

  // --- Nachricht bauen ---

  private buildMessage(): string {
    const problemsText = this.selectedProblems.size
      ? Array.from(this.selectedProblems).join(', ')
      : 'Keine Probleme ausgewählt';

    const formValue = this.contactForm.value;

    return [
      `Neue Reparaturanfrage (${this.currentDeviceLabel})`,
      '',
      `Probleme: ${problemsText}`,
      '',
      `Name: ${formValue.name || '-'}`,
      `Telefon: ${formValue.phoneNumber || '-'}`,
      `E-Mail: ${formValue.email || '-'}`,
      `Modell: ${formValue.deviceModel || '-'}`,
      '',
      `Beschreibung:`,
      `${formValue.description || '-'}`,
    ].join('\n');
  }

  sendRequest(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const message = this.buildMessage();
    const channel = this.contactForm.value.preferredChannel;

    if (channel === 'whatsapp') {
      const url = `${this.whatsappHref}?text=${encodeURIComponent(message)}`;
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    } else {
      // E-Mail
      const subject = encodeURIComponent(
        `Reparaturanfrage – ${this.currentDeviceLabel}`
      );
      const body = encodeURIComponent(message);
      const mailto = `mailto:${this.emailAddress}?subject=${subject}&body=${body}`;
      if (typeof window !== 'undefined') {
        window.location.href = mailto;
      }
    }

    this.closeModal();
  }
  get contactFormatted() {
  const format = (num: string) =>
    num.replace(/^\+49(\d{3})(\d{6,})$/, '+49 $1 $2');

  return {
    phone: format(this.contact.phone),
    mobilePhone: format(this.contact.mobilePhone),
    email: this.contact.email,
  };
}

}
