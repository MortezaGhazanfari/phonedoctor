export interface Kategorie {
  id: string;
  label: string;
  keywords: string[];
}

export const KATEGORIEN: Kategorie[] = [
  {
    id: 'wasserschaden',
    label: 'Wasserschaden',
    keywords: ['wasser', 'nass', 'flüssigkeit', 'pool', 'meer', 'waschmaschine', 'toilette', 'regen', 'getränk'],
  },
  {
    id: 'akku',
    label: 'Akku',
    keywords: ['akku', 'batterie', 'schnell leer', 'hält nicht', 'geht schnell aus', 'aufgebläht'],
  },
  {
    id: 'ladebuchse',
    label: 'Ladebuchse',
    keywords: ['lädt nicht', 'laedt nicht', 'laden', 'ladekabel', 'ladebuchse', 'buchse', 'stecker', 'usb', 'wackelkontakt'],
  },
  {
    id: 'kameraglas',
    label: 'Kameraglas',
    keywords: ['kameraglas', 'kamera glas', 'linse'],
  },
  {
    id: 'kamera',
    label: 'Kamera',
    keywords: ['kamera', 'foto', 'unscharf', 'selfie'],
  },
  {
    id: 'backcover',
    label: 'Rückseite / Backcover',
    keywords: ['rückseite', 'rueckseite', 'backcover', 'hinten kaputt', 'rückglas', 'hinterseite'],
  },
  {
    id: 'hoermuschel',
    label: 'Hörmuschel',
    keywords: ['hörmuschel', 'hoermuschel', 'höre nichts', 'schlecht hören', 'beim telefonieren leise'],
  },
  {
    id: 'lautsprecher',
    label: 'Lautsprecher',
    keywords: ['lautsprecher', 'ton', 'leise', 'musik', 'klingelton', 'kein sound'],
  },
  {
    id: 'staubnetz',
    label: 'Staubnetz / Lautsprecher-Reinigung',
    keywords: ['staub', 'staubnetz', 'dreck im lautsprecher'],
  },
  {
    id: 'mikrofon',
    label: 'Mikrofon',
    keywords: ['mikrofon', 'mikro', 'versteht mich nicht', 'hört mich nicht'],
  },
  {
    id: 'sim',
    label: 'SIM-Kartenleser',
    keywords: ['sim'],
  },
  {
    id: 'kopfhoererbuchse',
    label: 'Kopfhörerbuchse',
    keywords: ['kopfhörer', 'kopfhoerer', 'aux'],
  },
  {
    id: 'tastatur',
    label: 'Tastatur',
    keywords: ['tastatur', 'taste'],
  },
  {
    id: 'datenrettung',
    label: 'Datenrettung',
    keywords: ['datenrettung', 'daten retten', 'fotos retten', 'daten wichtig'],
  },
  {
    id: 'glas',
    label: 'Frontglas / Touchscreen',
    keywords: ['nur glas', 'touchscreen', 'touch geht nicht', 'reagiert nicht'],
  },
  {
    id: 'display',
    label: 'Display / Bildschirm',
    keywords: ['display', 'bildschirm', 'scheibe', 'glas', 'riss', 'gesprungen', 'gebrochen', 'anzeige', 'kein bild', 'schwarzes bild', 'streifen', 'pixel', 'flecken', 'runtergefallen', 'gefallen'],
  },
  {
    id: 'komplett',
    label: 'Komplett-Tausch',
    keywords: ['komplett', 'austauschgerät', 'tauschgerät'],
  },
];

export function kategorieLabel(id: string): string {
  return KATEGORIEN.find((k) => k.id === id)?.label ?? id;
}
