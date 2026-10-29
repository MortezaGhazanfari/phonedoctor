import { DeviceModel, PRICE_DATA } from '../preise/price-data';
import { geraeteTyp } from '../preise/geraete';

export interface Problem {
  /** Kategorie-ID aus der Preisdatenbank; ohne Preise dort zeigt die Seite „Preis nach Diagnose". */
  kategorie: string;
  titel: string;
  text: string;
}

export interface Faq {
  frage: string;
  antwort: string;
}

export interface ReparaturSeite {
  slug: string;
  kurzname: string;
  /** Wird in Fließtext eingesetzt: „Wir reparieren dein {geraet}". */
  geraet: string;
  /** Für Preisfragen: „Was kostet ein Display-Tausch {beimGeraet}?" */
  beimGeraet: string;
  titel: string;
  h1: string;
  beschreibung: string;
  intro: string[];
  marken: string;
  probleme: Problem[];
  faqs: Faq[];
  modelle: (m: DeviceModel) => boolean;
}

const ALLGEMEINE_FAQS: Faq[] = [
  {
    frage: 'Brauche ich einen Termin?',
    antwort:
      'Nein. Komm einfach während der Öffnungszeiten in die Borsigallee 37 (Frankfurt-Bergen-Enkheim, am Hessen-Center): Montag bis Freitag 09:30–17:30 Uhr, Samstag 11:00–17:00 Uhr. Wenn du sichergehen willst, dass dein Ersatzteil vorrätig ist, schreib uns vorher kurz per WhatsApp.',
  },
  {
    frage: 'Bekomme ich Garantie auf die Reparatur?',
    antwort:
      'Ja, auf verbaute Ersatzteile und unsere Arbeit gilt die gesetzliche Gewährleistung. Ausgenommen sind Wasserschäden und daraus entstehende Folgeschäden.',
  },
];

export const REPARATUR_SEITEN: ReparaturSeite[] = [
  {
    slug: 'handy-reparatur-frankfurt',
    kurzname: 'Handy-Reparatur',
    geraet: 'Handy',
    beimGeraet: 'beim Handy',
    titel: 'Handy Reparatur Frankfurt – Display, Akku, Ladebuchse | Phone Doctor',
    h1: 'Handy-Reparatur in Frankfurt',
    beschreibung:
      'Handy kaputt? Display gebrochen, Akku schlecht oder lädt nicht mehr? Phone Doctor in Frankfurt (Borsigallee 37) repariert Smartphones aller Marken – oft am selben Tag. Preise ab sofort online.',
    intro: [
      'Display gebrochen, Akku hält nicht mehr, das Handy lädt nicht oder ist ins Wasser gefallen? Bei Phone Doctor in Frankfurt reparieren wir Smartphones aller gängigen Marken – viele Reparaturen wie Display- oder Akku-Tausch sind noch am selben Tag fertig, oft während du wartest.',
      'Du findest uns in der Borsigallee 37 in Frankfurt-Bergen-Enkheim, direkt am Hessen-Center und gut erreichbar aus Seckbach, Fechenheim, Riederwald, Bornheim und Maintal. Vor jeder Reparatur bekommst du einen klaren Preis – ohne Überraschungen.',
    ],
    marken:
      'Wir reparieren iPhone, Samsung Galaxy, Google Pixel, Huawei, Sony Xperia, Xiaomi, OnePlus, Oppo, Motorola und weitere Marken.',
    probleme: [
      { kategorie: 'display', titel: 'Display gebrochen oder schwarz', text: 'Gesprungenes Glas, Streifen, Flecken, kein Bild oder Touch reagiert nicht – wir tauschen die komplette Displayeinheit.' },
      { kategorie: 'akku', titel: 'Akku schlecht oder schnell leer', text: 'Das Handy geht schnell aus, wird heiß oder der Akku ist aufgebläht? Ein neuer Akku bringt die volle Laufzeit zurück.' },
      { kategorie: 'ladebuchse', titel: 'Handy lädt nicht mehr', text: 'Wackelkontakt oder das Kabel hält nicht mehr? Oft hilft schon eine Reinigung, sonst tauschen wir die Ladebuchse.' },
      { kategorie: 'backcover', titel: 'Rückseite gebrochen', text: 'Wir ersetzen das gesprungene Rückglas, damit keine Splitter und kein Staub ins Gerät gelangen.' },
      { kategorie: 'kamera', titel: 'Kamera unscharf oder defekt', text: 'Verschwommene Fotos, schwarzes Kamerabild oder Kameraglas gesprungen – wir reparieren Kamera und Kameraglas.' },
      { kategorie: 'hoermuschel', titel: 'Kein Ton beim Telefonieren', text: 'Du hörst den Anrufer schlecht oder er versteht dich nicht? Wir prüfen Hörmuschel, Lautsprecher und Mikrofon.' },
      { kategorie: 'wasserschaden', titel: 'Wasserschaden', text: 'Sofort ausschalten, nicht laden und so schnell wie möglich vorbeibringen – je früher wir das Gerät öffnen, desto besser die Chancen.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich mein Handy in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main (Bergen-Enkheim, am Hessen-Center). Wir reparieren Smartphones aller gängigen Marken, du kannst ohne Termin vorbeikommen.',
      },
      {
        frage: 'Wie lange dauert eine Handy-Reparatur?',
        antwort:
          'Display- und Akku-Tausch sind bei vorrätigen Teilen meist in 30 bis 90 Minuten erledigt. Bei seltenen Modellen bestellen wir das Teil und melden uns, sobald dein Gerät fertig ist.',
      },
      {
        frage: 'Bleiben meine Daten bei der Reparatur erhalten?',
        antwort:
          'Bei Display-, Akku- oder Ladebuchsen-Reparaturen bleiben deine Daten auf dem Gerät. Ein Backup vorher schadet trotzdem nie.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => geraeteTyp(m) === 'handy',
  },
  {
    slug: 'iphone-reparatur-frankfurt',
    kurzname: 'iPhone-Reparatur',
    geraet: 'iPhone',
    beimGeraet: 'beim iPhone',
    titel: 'iPhone Reparatur Frankfurt – Display & Akku Tausch | Phone Doctor',
    h1: 'iPhone-Reparatur in Frankfurt',
    beschreibung:
      'iPhone Display gebrochen oder Akku schwach? iPhone-Reparatur in Frankfurt für alle Modelle von iPhone 6 bis iPhone 16 – mit Original- oder Qualitätsteilen, oft am selben Tag. Preise online.',
    intro: [
      'Ob iPhone 16, iPhone 13 oder ein älteres Modell: Wir reparieren iPhones jeder Generation – Display, Akku, Ladebuchse, Kamera, Rückglas und mehr. Bei Display und Akku hast du meist die Wahl zwischen Apple-Originalteil und günstigeren Qualitätsstufen; wir beraten dich ehrlich, was sich für dein Gerät lohnt.',
      'Die meisten iPhone-Reparaturen erledigen wir noch am selben Tag in unserem Laden in der Borsigallee 37 in Frankfurt.',
    ],
    marken: 'Wir reparieren alle iPhone-Modelle, auch iPhone SE, mini, Plus, Pro und Pro Max.',
    probleme: [
      { kategorie: 'display', titel: 'iPhone Display gebrochen', text: 'Wahlweise mit Apple-Originalteil, Refurbished-, Premium- (OLED) oder Standard-Display – je nach Budget.' },
      { kategorie: 'akku', titel: 'iPhone Akku schwach', text: 'Akkuzustand unter 80 %, Gerät geht plötzlich aus oder wird langsam? Ein neuer Akku hilft.' },
      { kategorie: 'backcover', titel: 'iPhone Rückglas gebrochen', text: 'Wir tauschen das Rückglas – bei Bedarf inklusive Rahmen.' },
      { kategorie: 'ladebuchse', titel: 'iPhone lädt nicht', text: 'Lightning- oder USB-C-Buchse reinigen oder tauschen.' },
      { kategorie: 'kamera', titel: 'iPhone Kamera defekt', text: 'Kamera wackelt, ist unscharf oder schwarz – wir tauschen das Kameramodul.' },
      { kategorie: 'kameraglas', titel: 'iPhone Kameraglas gesprungen', text: 'Ein gesprungenes Kameraglas lässt Staub und Feuchtigkeit herein – schnell und günstig ersetzt.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich mein iPhone in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main. Wir reparieren alle iPhone-Modelle, meist am selben Tag und ohne Termin.',
      },
      {
        frage: 'Verwendet ihr Original-Apple-Teile?',
        antwort:
          'Für Display und Akku bieten wir je nach Modell Apple-Originalteile an. Alternativ gibt es günstigere, geprüfte Qualitätsteile – du entscheidest vor der Reparatur.',
      },
      {
        frage: 'Funktioniert Face ID nach dem Display-Tausch noch?',
        antwort: 'Ja, beim Display-Tausch bleibt Face ID erhalten, weil die Sensoren im Gerät bleiben.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => m.brand === 'Apple' && geraeteTyp(m) === 'handy',
  },
  {
    slug: 'samsung-reparatur-frankfurt',
    kurzname: 'Samsung-Reparatur',
    geraet: 'Samsung Galaxy',
    beimGeraet: 'beim Samsung Galaxy',
    titel: 'Samsung Galaxy Reparatur Frankfurt – Display & Akku | Phone Doctor',
    h1: 'Samsung-Galaxy-Reparatur in Frankfurt',
    beschreibung:
      'Samsung Display kaputt oder Akku schlecht? Reparatur für Galaxy S, A, Note, Z Flip und Z Fold in Frankfurt – mit Samsung-Originalteilen, oft am selben Tag. Preise online.',
    intro: [
      'Galaxy S, Galaxy A, Note oder ein Foldable wie Z Flip und Z Fold: Wir reparieren Samsung-Smartphones aller Serien. Displays, Akkus und Rückgläser verbauen wir bevorzugt als Samsung-Originalteile.',
      'Bring dein Galaxy einfach in die Borsigallee 37 in Frankfurt – die meisten Reparaturen sind noch am selben Tag fertig.',
    ],
    marken: 'Wir reparieren Galaxy S, Galaxy A, Galaxy M, Galaxy Note sowie Galaxy Z Flip und Z Fold.',
    probleme: [
      { kategorie: 'display', titel: 'Samsung Display gebrochen', text: 'Wir tauschen die komplette Displayeinheit – bei AMOLED-Displays meist als Samsung-Originalteil.' },
      { kategorie: 'akku', titel: 'Samsung Akku schwach', text: 'Akku leer, aufgebläht oder das Handy geht aus? Wir setzen einen neuen Akku ein.' },
      { kategorie: 'backcover', titel: 'Rückseite gebrochen', text: 'Gesprungenes Backcover-Glas ersetzen wir schnell und sauber.' },
      { kategorie: 'ladebuchse', titel: 'Galaxy lädt nicht', text: 'USB-C-Buchse reinigen oder tauschen.' },
      { kategorie: 'kameraglas', titel: 'Kameraglas gesprungen', text: 'Schutz für die Kamera – schnell ersetzt.' },
      { kategorie: 'mikrofon', titel: 'Mikrofon oder Hörmuschel defekt', text: 'Wenn dich beim Telefonieren niemand versteht oder du nichts hörst.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich mein Samsung-Handy in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main. Wir reparieren alle Galaxy-Serien, ohne Termin und meist am selben Tag.',
      },
      {
        frage: 'Funktioniert der Fingerabdrucksensor nach dem Display-Tausch?',
        antwort: 'In der Regel ja. Nach dem Tausch speicherst du deinen Fingerabdruck einfach neu ab – wir prüfen die Funktion vor der Übergabe.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => m.brand === 'Samsung' && geraeteTyp(m) === 'handy',
  },
  {
    slug: 'tablet-reparatur-frankfurt',
    kurzname: 'Tablet- & iPad-Reparatur',
    geraet: 'Tablet',
    beimGeraet: 'beim Tablet oder iPad',
    titel: 'iPad & Tablet Reparatur Frankfurt – Display, Akku | Phone Doctor',
    h1: 'iPad- und Tablet-Reparatur in Frankfurt',
    beschreibung:
      'iPad Display gesprungen oder Tablet lädt nicht? Reparatur für iPad, Samsung Galaxy Tab und Microsoft Surface in Frankfurt (Borsigallee 37). Preise online, unverbindliche Beratung.',
    intro: [
      'Tablets fallen gerne mal runter: Gesprungenes Glas, ein Touchscreen, der nicht mehr reagiert, ein schwacher Akku oder eine defekte Ladebuchse sind die häufigsten Schäden. Wir reparieren iPad, iPad Air, iPad mini und iPad Pro, Samsung Galaxy Tab sowie Microsoft Surface.',
      'Bei vielen Modellen tauschen wir nur das Glas statt des ganzen Displays – das spart Geld.',
    ],
    marken: 'Wir reparieren Apple iPad (alle Generationen), Samsung Galaxy Tab, Microsoft Surface, Huawei MediaPad und weitere Tablets.',
    probleme: [
      { kategorie: 'glas', titel: 'Glas gesprungen / Touch reagiert nicht', text: 'Bei vielen iPads und Tablets kann nur das Touchscreen-Glas getauscht werden.' },
      { kategorie: 'display', titel: 'Display defekt', text: 'Kein Bild, Streifen oder Flecken – wir tauschen die Displayeinheit.' },
      { kategorie: 'akku', titel: 'Akku schwach', text: 'Das Tablet hält keinen Tag mehr durch? Ein neuer Akku hilft.' },
      { kategorie: 'ladebuchse', titel: 'Tablet lädt nicht', text: 'Ladebuchse reinigen oder tauschen.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich mein iPad in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main. Wir reparieren alle iPad-Generationen sowie Samsung Galaxy Tab und Microsoft Surface.',
      },
      {
        frage: 'Lohnt sich die Reparatur eines älteren iPads?',
        antwort:
          'Oft ja – ein neues Glas oder ein neuer Akku kosten nur einen Bruchteil eines neuen Tablets. Wir sagen dir ehrlich, wenn sich eine Reparatur nicht mehr lohnt.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => geraeteTyp(m) === 'tablet',
  },
  {
    slug: 'macbook-reparatur-frankfurt',
    kurzname: 'MacBook-Reparatur',
    geraet: 'MacBook',
    beimGeraet: 'beim MacBook',
    titel: 'MacBook Reparatur Frankfurt – Display, Akku, Tastatur | Phone Doctor',
    h1: 'MacBook- und Mac-Reparatur in Frankfurt',
    beschreibung:
      'MacBook defekt? Display gebrochen, Akku schlecht, Tastatur kaputt oder Wasserschaden? MacBook-Air- und MacBook-Pro-Reparatur in Frankfurt inkl. Datenrettung. Preise online.',
    intro: [
      'Dein MacBook startet nicht mehr, das Display ist gebrochen, der Akku ist schwach oder es ist Kaffee über die Tastatur gelaufen? Wir reparieren MacBook Air und MacBook Pro – vom Display- und Akku-Tausch über Tastatur und Ladeanschluss bis zur Wasserschaden-Behandlung und Datenrettung.',
      'Auch für neuere MacBooks mit M-Chip und andere Mac-Modelle bekommst du bei uns eine Diagnose und einen Kostenvoranschlag. Bring dein Gerät einfach in die Borsigallee 37 in Frankfurt.',
    ],
    marken: 'Wir reparieren MacBook Air, MacBook Pro (auch Retina und Touch Bar) und weitere Mac-Modelle – neuere Modelle auf Anfrage.',
    probleme: [
      { kategorie: 'display', titel: 'MacBook Display gebrochen', text: 'Gesprungenes Display, Streifen oder kein Bild – wir tauschen die Displayeinheit.' },
      { kategorie: 'akku', titel: 'MacBook Akku schlecht', text: 'Meldung „Batterie warten", kurze Laufzeit oder aufgeblähter Akku – wir setzen einen neuen Akku ein.' },
      { kategorie: 'tastatur', titel: 'Tastatur defekt', text: 'Klemmende, doppelt tippende oder ausgefallene Tasten – wir tauschen Tastatur bzw. Topcase.' },
      { kategorie: 'ladebuchse', titel: 'MacBook lädt nicht', text: 'MagSafe- oder Ladeanschluss defekt? Wir prüfen und reparieren den Ladeanschluss.' },
      { kategorie: 'wasserschaden', titel: 'Wasserschaden / Flüssigkeit', text: 'Sofort ausschalten und nicht wieder einschalten – je schneller wir reinigen, desto besser.' },
      { kategorie: 'datenrettung', titel: 'Datenrettung', text: 'Dein Mac startet nicht mehr, aber die Daten sind wichtig? Wir versuchen, deine Daten zu retten.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich mein MacBook in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main. Wir reparieren MacBook Air und MacBook Pro – Display, Akku, Tastatur, Ladeanschluss, Wasserschaden und Datenrettung.',
      },
      {
        frage: 'Mein MacBook ist defekt und startet nicht – was kostet die Diagnose?',
        antwort:
          'Die Fehlerdiagnose mit Kostenvoranschlag kostet 15 €, bei Wasserschaden 30 €. Erst danach entscheidest du, ob wir reparieren sollen.',
      },
      {
        frage: 'Repariert ihr auch neuere MacBooks mit M1, M2 oder M3?',
        antwort:
          'Bring dein Gerät gerne vorbei oder schreib uns das Modell per WhatsApp – wir prüfen, welche Reparatur möglich ist, und nennen dir den Preis.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => geraeteTyp(m) === 'mac',
  },
  {
    slug: 'laptop-reparatur-frankfurt',
    kurzname: 'Laptop- & Notebook-Reparatur',
    geraet: 'Laptop',
    beimGeraet: 'beim Laptop',
    titel: 'Laptop & Notebook Reparatur Frankfurt – alle Marken | Phone Doctor',
    h1: 'Laptop- und Notebook-Reparatur in Frankfurt',
    beschreibung:
      'Laptop kaputt? Display gebrochen, Akku schwach, Tastatur defekt oder Notebook wird heiß? Reparatur für Lenovo, HP, Dell, Asus, Acer, MacBook und Surface in Frankfurt.',
    intro: [
      'Ob Lenovo, HP, Dell, Asus, Acer, MSI, Microsoft Surface oder MacBook: Wir reparieren Notebooks aller gängigen Marken. Typische Reparaturen sind Display-Tausch, neuer Akku, Tastatur, defekter Ladeanschluss, Reinigung bei Überhitzung und Datenrettung.',
      'Bring deinen Laptop in die Borsigallee 37 in Frankfurt – nach der Diagnose bekommst du einen verbindlichen Preis.',
    ],
    marken: 'Wir reparieren Lenovo, HP, Dell, Asus, Acer, MSI, Microsoft Surface, Apple MacBook und weitere Marken.',
    probleme: [
      { kategorie: 'display', titel: 'Laptop-Display gebrochen', text: 'Gesprungenes Display, Streifen oder kein Bild – wir tauschen das Panel.' },
      { kategorie: 'akku', titel: 'Akku hält nicht mehr', text: 'Der Laptop läuft nur noch am Netzteil? Ein neuer Akku bringt dir die Mobilität zurück.' },
      { kategorie: 'tastatur', titel: 'Tastatur defekt', text: 'Ausgefallene oder klemmende Tasten – wir tauschen die Tastatur.' },
      { kategorie: 'ladebuchse', titel: 'Laptop lädt nicht', text: 'Wackelkontakt am Ladeanschluss oder DC-Buchse defekt – wir reparieren das.' },
      { kategorie: 'reinigung', titel: 'Laptop wird heiß oder laut', text: 'Lüfter-Reinigung und neue Wärmeleitpaste helfen gegen Überhitzung und Abstürze.' },
      { kategorie: 'datenrettung', titel: 'Datenrettung', text: 'Festplatte oder SSD defekt, Laptop startet nicht? Wir versuchen, deine Daten zu retten.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich meinen Laptop in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main. Wir reparieren Notebooks aller gängigen Marken, du kannst ohne Termin vorbeikommen.',
      },
      {
        frage: 'Was kostet eine Laptop-Reparatur?',
        antwort:
          'Das hängt stark von Marke, Modell und Schaden ab. Die Fehlerdiagnose mit Kostenvoranschlag kostet 15 €; danach nennen wir dir den genauen Preis, bevor wir reparieren.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => geraeteTyp(m) === 'notebook' || geraeteTyp(m) === 'mac',
  },
  {
    slug: 'smartwatch-reparatur-frankfurt',
    kurzname: 'Smartwatch-Reparatur',
    geraet: 'Smartwatch',
    beimGeraet: 'bei der Apple Watch',
    titel: 'Apple Watch & Smartwatch Reparatur Frankfurt | Phone Doctor',
    h1: 'Apple-Watch- und Smartwatch-Reparatur in Frankfurt',
    beschreibung:
      'Apple Watch Display gesprungen oder Akku schwach? Smartwatch-Reparatur in Frankfurt für Apple Watch Series, SE und Ultra – weitere Marken auf Anfrage. Preise online.',
    intro: [
      'Das Glas deiner Apple Watch ist gesprungen, das Display bleibt schwarz oder der Akku hält keinen Tag mehr durch? Wir reparieren Apple Watch Series, SE und Ultra in Frankfurt.',
      'Für Smartwatches anderer Hersteller wie Samsung Galaxy Watch prüfen wir gerne, ob eine Reparatur möglich ist – schreib uns einfach das Modell.',
    ],
    marken: 'Wir reparieren Apple Watch (Series, SE, Ultra); Samsung Galaxy Watch und weitere Smartwatches auf Anfrage.',
    probleme: [
      { kategorie: 'glas', titel: 'Glas gesprungen', text: 'Bei vielen Apple-Watch-Modellen tauschen wir nur das Glas.' },
      { kategorie: 'display', titel: 'Display defekt', text: 'Kein Bild oder Touch reagiert nicht – wir tauschen das Display.' },
      { kategorie: 'akku', titel: 'Akku schwach', text: 'Die Uhr hält keinen Tag mehr durch? Ein neuer Akku hilft.' },
    ],
    faqs: [
      {
        frage: 'Wo kann ich meine Apple Watch in Frankfurt reparieren lassen?',
        antwort:
          'Bei Phone Doctor in der Borsigallee 37, 60388 Frankfurt am Main. Wir reparieren Glas, Display und Akku der Apple Watch.',
      },
      ...ALLGEMEINE_FAQS,
    ],
    modelle: (m) => geraeteTyp(m) === 'smartwatch',
  },
];

export function findeSeite(slug: string): ReparaturSeite | undefined {
  return REPARATUR_SEITEN.find((s) => s.slug === slug);
}

export function seiteFuerModell(m: DeviceModel): ReparaturSeite {
  const typ = geraeteTyp(m);
  const slug =
    typ === 'handy'
      ? m.brand === 'Apple'
        ? 'iphone-reparatur-frankfurt'
        : m.brand === 'Samsung'
          ? 'samsung-reparatur-frankfurt'
          : 'handy-reparatur-frankfurt'
      : typ === 'tablet'
        ? 'tablet-reparatur-frankfurt'
        : typ === 'mac'
          ? 'macbook-reparatur-frankfurt'
          : typ === 'notebook'
            ? 'laptop-reparatur-frankfurt'
            : 'smartwatch-reparatur-frankfurt';
  return findeSeite(slug)!;
}

export function modelleFuer(seite: ReparaturSeite): DeviceModel[] {
  return PRICE_DATA.filter(seite.modelle);
}
