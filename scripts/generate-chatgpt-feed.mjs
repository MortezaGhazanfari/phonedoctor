// Erzeugt den Produktfeed für den ChatGPT Business Hub (Bereich „Produkte“) aus den Preisdaten:
// eine Zeile je Modell, Reparatur und Qualitätsstufe. „ab“-Preise werden ausgelassen, weil der
// Feed einen festen Preis verlangt. Aufruf: npm run chatgpt-feed
// Feldnamen nach https://developers.openai.com/commerce/specs/file-upload/products
import { buildSync } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ziel = resolve(root, '../chatgpt-feed/phonedoctor-produkte.csv');

const { outputFiles } = buildSync({
  entryPoints: [resolve(root, 'scripts/seo-daten.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const daten = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const { PRICE_DATA, CONTACT_CONFIG, SITE_URL, anzeigeName, modellSlug, telefonAnzeige } = daten;

const REPARATUR = {
  display: 'Display-Reparatur',
  glas: 'Frontglas-Tausch',
  akku: 'Akku-Tausch',
  ladebuchse: 'Ladebuchse-Reparatur',
  backcover: 'Rückseite-Tausch (Backcover)',
  kameraglas: 'Kameraglas-Tausch',
  kamera: 'Kamera-Reparatur',
  hoermuschel: 'Hörmuschel-Reparatur',
  lautsprecher: 'Lautsprecher-Reparatur',
  staubnetz: 'Lautsprecher-Reinigung (Staubnetz)',
  mikrofon: 'Mikrofon-Reparatur',
  sim: 'SIM-Kartenleser-Reparatur',
  kopfhoererbuchse: 'Kopfhörerbuchse-Reparatur',
  tastatur: 'Tastatur-Reparatur',
  datenrettung: 'Datenrettung',
  wasserschaden: 'Wasserschaden-Reparatur',
  komplett: 'Komplett-Tausch',
};

const SPALTEN = [
  'item_id', 'title', 'description', 'url', 'brand', 'seller_name', 'seller_url', 'image_url',
  'price', 'availability', 'product_category', 'target_countries', 'store_country',
  'is_eligible_search', 'is_eligible_checkout',
];

const zelle = (wert) => {
  const s = String(wert);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const slug = (s) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const zeilen = [];
const ids = new Set();
for (const m of PRICE_DATA) {
  const geraet = anzeigeName(m);
  for (const [kat, eintraege] of Object.entries(m.repairs)) {
    const reparatur = REPARATUR[kat];
    if (!reparatur) throw new Error(`Unbekannte Reparaturart: ${kat}`);
    for (const e of eintraege) {
      if (e.q === 'ab') continue;
      const qualitaet = e.q ? ` (${e.q})` : '';
      const id = [modellSlug(m), kat, e.q && slug(e.q)].filter(Boolean).join('-');
      if (ids.has(id)) throw new Error(`Doppelte item_id: ${id}`);
      ids.add(id);
      zeilen.push({
        item_id: id,
        title: `${geraet} ${reparatur}${qualitaet} in Frankfurt – Phone Doctor`,
        description:
          `${reparatur}${qualitaet} für ${geraet} bei Phone Doctor in Frankfurt-Bergen-Enkheim, ` +
          `Borsigallee 37, direkt gegenüber dem Hessen-Center (nicht im Einkaufszentrum). ` +
          `Preis: ${e.p} €. Ohne Termin, viele Reparaturen am selben Tag` +
          (kat === 'wasserschaden' ? '. ' : ', 6 Monate Garantie auf Ersatzteil und Arbeit. ') +
          `Deine Daten bleiben in der Regel erhalten. Telefon ${telefonAnzeige(CONTACT_CONFIG.phone)}, WhatsApp ${telefonAnzeige(CONTACT_CONFIG.mobilePhone)}.`,
        url: `${SITE_URL}/preise/${modellSlug(m)}/`,
        brand: CONTACT_CONFIG.shopName,
        seller_name: CONTACT_CONFIG.shopName,
        seller_url: `${SITE_URL}/`,
        image_url: `${SITE_URL}/assets/logo.png`,
        price: `${e.p.toFixed(2)} EUR`,
        availability: 'in_stock',
        product_category: 'Dienstleistungen > Reparatur > Elektronik-Reparatur',
        target_countries: '["DE"]',
        store_country: 'DE',
        is_eligible_search: 'true',
        is_eligible_checkout: 'false',
      });
    }
  }
}

mkdirSync(dirname(ziel), { recursive: true });
writeFileSync(
  ziel,
  [SPALTEN.join(','), ...zeilen.map((z) => SPALTEN.map((s) => zelle(z[s])).join(','))].join('\n') + '\n',
);
console.log(`${zeilen.length} Einträge → ${ziel}`);
