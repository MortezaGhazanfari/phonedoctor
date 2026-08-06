import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../core/nav-bar/nav-bar.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { CONTACT_CONFIG } from '../../core/contact/contact.config.config';

interface FaqEntry {
  frage: string;
  antwort: string;
}

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  contact = CONTACT_CONFIG;

  faqs: FaqEntry[] = [
    {
      frage: 'Was kostet eine Handy-Reparatur bei Phone Doctor in Frankfurt?',
      antwort:
        'Der Preis hängt vom Gerät und vom Schaden ab – ein Display-Tausch beim iPhone kostet anders als bei einem Samsung Galaxy oder Xiaomi. Du bekommst vor jeder Reparatur einen unverbindlichen Kostenvoranschlag. Am schnellsten geht es, wenn du uns dein Modell und den Schaden per WhatsApp schickst – dann nennen wir dir direkt einen Preis.',
    },
    {
      frage: 'Wie lange dauert eine Display- oder Akku-Reparatur?',
      antwort:
        'Viele Standardreparaturen wie Display-Tausch oder Akku-Wechsel erledigen wir noch am selben Tag, oft während du wartest. Die genaue Dauer hängt vom Modell und der Ersatzteil-Verfügbarkeit ab – ruf kurz an oder schreib uns per WhatsApp, dann sagen wir dir, wie schnell es geht.',
    },
    {
      frage: 'Brauche ich einen Termin?',
      antwort:
        'Nein, du kannst einfach während der Öffnungszeiten vorbeikommen: Montag bis Freitag 09:30–17:30 Uhr, Samstag 11:00–17:00 Uhr. Wenn du sichergehen willst, dass dein Ersatzteil vorrätig ist, melde dich am besten vorher kurz per WhatsApp oder Telefon an.',
    },
    {
      frage: 'Welche Geräte repariert ihr?',
      antwort:
        'Wir reparieren Smartphones, Tablets, PCs und Laptops, Spielkonsolen, Fernseher und E-Scooter. Auch bei anderen Elektronikgeräten hilft dir unser Team gern weiter – frag einfach nach.',
    },
    {
      frage: 'Welche Marken repariert ihr?',
      antwort:
        'Alle gängigen Marken: Apple (iPhone, iPad, MacBook), Samsung Galaxy, Xiaomi, Huawei, Google Pixel, OnePlus und viele mehr. Auch ältere Modelle sind kein Problem, solange Ersatzteile verfügbar sind.',
    },
    {
      frage: 'Mein Handy geht nicht mehr an – könnt ihr helfen?',
      antwort:
        'Ja, bring das Gerät einfach vorbei. Wir prüfen, woran es liegt – oft ist es nur der Akku oder die Ladebuchse. Danach bekommst du einen unverbindlichen Kostenvoranschlag, und du entscheidest, ob wir reparieren sollen.',
    },
    {
      frage: 'Was soll ich bei einem Wasserschaden tun?',
      antwort:
        'Schalte das Gerät sofort aus, lade es nicht auf und versuche nicht, es mit einem Föhn zu trocknen. Bring es so schnell wie möglich zu uns – je früher wir das Gerät öffnen und reinigen können, desto höher sind die Rettungschancen. Bei Wasserschäden können wir allerdings keine Garantie auf die dauerhafte Funktion geben.',
    },
    {
      frage: 'Bleiben meine Daten bei der Reparatur erhalten?',
      antwort:
        'Bei den meisten Reparaturen wie Display- oder Akku-Tausch bleiben deine Daten unberührt auf dem Gerät. Wir empfehlen trotzdem, vorher ein Backup zu machen, falls das möglich ist. Deine Daten werden bei uns selbstverständlich vertraulich behandelt.',
    },
    {
      frage: 'Bekomme ich Garantie auf die Reparatur?',
      antwort:
        'Ja, auf die verbauten Ersatzteile und unsere Arbeit gilt die gesetzliche Gewährleistung. Ausgenommen sind Wasserschäden und daraus entstehende Folgeschäden – dort lässt sich eine dauerhafte Funktion technisch nicht garantieren.',
    },
    {
      frage: 'Verwendet ihr Originalteile?',
      antwort:
        'Wir verbauen hochwertige, geprüfte Ersatzteile. Je nach Modell gibt es verschiedene Qualitätsstufen – wir beraten dich vor der Reparatur offen, welche Option für dein Gerät und dein Budget am meisten Sinn ergibt.',
    },
    {
      frage: 'Lohnt sich die Reparatur oder soll ich lieber ein neues Handy kaufen?',
      antwort:
        'In den meisten Fällen ist die Reparatur deutlich günstiger als ein Neukauf – und nachhaltiger. Wir beraten dich ehrlich: Wenn sich eine Reparatur bei deinem Gerät nicht mehr lohnt, sagen wir dir das offen.',
    },
    {
      frage: 'Wie erfahre ich, wann mein Gerät fertig ist?',
      antwort:
        'Wir benachrichtigen dich, sobald dein Gerät abholbereit ist – auf Wunsch per E-Mail, Anruf oder WhatsApp. Über den Link in unserer Status-E-Mail kannst du den Stand deiner Reparatur auch jederzeit online einsehen.',
    },
    {
      frage: 'Verkauft ihr auch Zubehör?',
      antwort:
        'Ja, bei uns bekommst du auch Zubehör wie Hüllen, Panzerglas und Kopfhörer. Auf Wunsch bringen wir den Displayschutz direkt nach der Reparatur an.',
    },
    {
      frage: 'Wo finde ich euch in Frankfurt?',
      antwort:
        'Du findest uns in der Borsigallee 37, 60388 Frankfurt am Main (Fechenheim, nahe Hessen-Center). Erreichbar sind wir unter 06109 7196886, mobil und per WhatsApp unter 0176 80733316 oder per E-Mail an info@phonedoctorffm.de.',
    },
  ];

  constructor(@Inject(DOCUMENT) doc: Document, meta: Meta) {
    meta.updateTag({
      name: 'description',
      content:
        'Antworten auf häufige Fragen zur Handy-Reparatur in Frankfurt: Kosten, Dauer, Garantie, Wasserschaden, Datenerhalt und mehr – Phone Doctor, Borsigallee 37.',
    });

    if (!doc.getElementById('faq-jsonld')) {
      const script = doc.createElement('script');
      script.id = 'faq-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: this.faqs.map((f) => ({
          '@type': 'Question',
          name: f.frage,
          acceptedAnswer: { '@type': 'Answer', text: f.antwort },
        })),
      });
      doc.head.appendChild(script);
    }
  }

  get whatsappHref(): string {
    const digits = this.contact.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
}
