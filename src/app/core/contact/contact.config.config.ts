// src/app/core/contact.config.ts

export interface OpeningHours {
  label: string;   // z.B. "Mo–Fr"
  time: string;    // z.B. "09:30 – 17:30 Uhr"
}

export interface ContactConfig {
  shopName: string;
  address: string;
  phone: string;
  mobilePhone: string;
  whatsapp: string;
  email: string;
  openingHours: OpeningHours[];
}

// Anzeigeform wie im llms.txt: Mobilvorwahlen (01x) sind vierstellig, die Festnetzvorwahl 06109 fünfstellig.
export function telefonAnzeige(nr: string): string {
  const national = nr.replace(/^\+49/, '0');
  const vorwahl = national.startsWith('01') ? 4 : 5;
  return `${national.slice(0, vorwahl)} ${national.slice(vorwahl)}`;
}

export const CONTACT_CONFIG: ContactConfig = {
  shopName: 'Phone Doctor',
  address: 'Borsigallee 37, 60388 Frankfurt',
  phone: '+4961097196886',
  mobilePhone: '+4917680733316',
  whatsapp: '+4917680733316',
  email: 'info@phonedoctorffm.de',
  openingHours: [
    { label: 'Mo–Fr', time: '09:30 – 17:30 Uhr' },
    { label: 'Sa',    time: '11:00 – 17:00 Uhr' },
    { label: 'So & Feiertage', time: 'geschlossen' },
  ],
};

