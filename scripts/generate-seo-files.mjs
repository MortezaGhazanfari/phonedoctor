// Erzeugt sitemap.xml, llms.txt, die Prerender-Routenliste sowie unter generated/ die
// Markdown-Fassungen der Seiten und preise.json aus den Preis- und Seitendaten.
// Läuft automatisch vor `npm run build` (prebuild).
import { buildSync } from 'esbuild';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const { outputFiles } = buildSync({
  entryPoints: [resolve(root, 'scripts/seo-daten.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const daten = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const { PRICE_DATA, REPARATUR_SEITEN, KATEGORIEN, CONTACT_CONFIG, SITE_URL, FAQS, modelleFuer, abPreis, abPreisFuer, anzeigeName, modellSlug } = daten;

const heute = new Date().toISOString().slice(0, 10);
const url = (pfad) => `${SITE_URL}${pfad === '/' ? '/' : `${pfad}/`}`;

const slugs = PRICE_DATA.map(modellSlug);
const doppelt = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (doppelt.length) {
  throw new Error(`Doppelte Modell-Adressen: ${doppelt.join(', ')}`);
}

const reparaturPfade = REPARATUR_SEITEN.map((s) => `/reparatur/${s.slug}`);
const modellPfade = slugs.map((s) => `/preise/${s}`);

// --- Prerender-Routen (statische Routen findet Angular selbst) ---
writeFileSync(resolve(root, 'prerender-routes.txt'), [...reparaturPfade, ...modellPfade].join('\n') + '\n');

// --- Sitemap ---
const sitemapEintraege = [
  ['/', '1.0'],
  ['/preise', '0.9'],
  ...reparaturPfade.map((p) => [p, '0.9']),
  ['/faq', '0.8'],
  ['/kontakt', '0.8'],
  ['/ueber-uns', '0.6'],
  ...modellPfade.map((p) => [p, '0.6']),
  ['/impressum', '0.2'],
  ['/agb', '0.2'],
  ['/datenschutz', '0.2'],
];
writeFileSync(
  resolve(root, 'src/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEintraege
  .map(([p, prio]) => `  <url>\n    <loc>${url(p)}</loc>\n    <lastmod>${heute}</lastmod>\n    <priority>${prio}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`,
);

// --- llms.txt ---
// Mobilvorwahlen (01x) sind vierstellig, die Festnetzvorwahl 06109 fünfstellig.
const telefon = (nr) => {
  const national = nr.replace(/^\+49/, '0');
  const vorwahl = national.startsWith('01') ? 4 : 5;
  return `${national.slice(0, vorwahl)} ${national.slice(vorwahl)}`;
};
const label = (id) => KATEGORIEN.find((k) => k.id === id)?.label ?? id;
const abText = (modelle, kategorien) =>
  kategorien
    .map((k) => [k, abPreisFuer(modelle, k)])
    .filter(([, p]) => p !== null)
    .map(([k, p]) => `${label(k)} ab ${p} €`)
    .join(', ');

const zeilen = [
  '# Phone Doctor Frankfurt',
  '',
  `> Reparaturwerkstatt für Handys, iPhones, Samsung Galaxy, Tablets und iPads, MacBooks und Laptops sowie Smartwatches aller Marken in Frankfurt am Main (${CONTACT_CONFIG.address}, Bergen-Enkheim, am Hessen-Center). Display-Tausch, Akku-Tausch, Ladebuchse, Rückglas, Kamera, Wasserschaden und Datenrettung – viele Reparaturen am selben Tag, ohne Termin.`,
  '',
  '## Kontakt und Öffnungszeiten',
  '',
  `- Adresse: ${CONTACT_CONFIG.address}`,
  ...CONTACT_CONFIG.openingHours.map((oh) => `- ${oh.label}: ${oh.time}`),
  `- Telefon: ${telefon(CONTACT_CONFIG.phone)}`,
  `- Mobil und WhatsApp: ${telefon(CONTACT_CONFIG.mobilePhone)}`,
  `- E-Mail: ${CONTACT_CONFIG.email}`,
  '- Google Maps: https://maps.google.com/?cid=3590818545737842092',
  `- Fehlerdiagnose mit Kostenvoranschlag: 15 €, bei Wasserschaden 30 €`,
  '',
  '## Reparaturen nach Gerät',
  '',
  ...REPARATUR_SEITEN.map((s) => {
    const preise = abText(modelleFuer(s), s.probleme.map((p) => p.kategorie));
    return `- [${s.kurzname}](${url(`/reparatur/${s.slug}`)}): ${s.marken}${preise ? ` Preise: ${preise}.` : ''}`;
  }),
  '',
  '## Weitere Seiten',
  '',
  `- [Preisrechner und Preisliste](${url('/preise')}): Modell wählen, Schaden beschreiben, voraussichtlichen Preis sehen`,
  `- [Häufige Fragen](${url('/faq')})`,
  `- [Kontakt](${url('/kontakt')})`,
  `- [Über uns](${url('/ueber-uns')})`,
  `- [Impressum](${url('/impressum')}) · [AGB](${url('/agb')}) · [Datenschutz](${url('/datenschutz')})`,
  '',
  '## Reparaturpreise nach Modell',
  '',
  'Unverbindliche Richtpreise (Stand August 2026), je nach Ersatzteil-Qualität.',
  '',
  ...PRICE_DATA.map((m) => {
    const teile = ['display', 'glas', 'akku', 'ladebuchse', 'backcover', 'tastatur']
      .map((k) => [k, abPreis(m.repairs[k])])
      .filter(([, p]) => p !== null)
      .map(([k, p]) => `${label(k)} ab ${p} €`);
    return `- [${anzeigeName(m)}](${url(`/preise/${modellSlug(m)}`)}): ${teile.join(', ') || 'Preis auf Anfrage'}`;
  }),
  '',
];
writeFileSync(resolve(root, 'src/llms.txt'), zeilen.join('\n'));

// --- generated/: Markdown je Seite (Auslieferung bei "Accept: text/markdown", siehe src/.htaccess) und preise.json ---
const gen = resolve(root, 'generated');
rmSync(gen, { recursive: true, force: true });
const schreibeMd = (pfad, inhalt) => {
  const ordner = resolve(gen, `.${pfad}`);
  mkdirSync(ordner, { recursive: true });
  writeFileSync(resolve(ordner, 'index.md'), inhalt.join('\n') + '\n');
};
const qualitaet = (q) => (!q ? 'Austausch / Reparatur' : q === 'ab' ? 'Preis ab' : q);
const kontaktMd = [
  '## Kontakt',
  '',
  `- Phone Doctor, ${CONTACT_CONFIG.address} (Bergen-Enkheim, am Hessen-Center)`,
  ...CONTACT_CONFIG.openingHours.map((oh) => `- ${oh.label}: ${oh.time}`),
  `- Telefon ${telefon(CONTACT_CONFIG.phone)}, WhatsApp ${telefon(CONTACT_CONFIG.mobilePhone)}, E-Mail ${CONTACT_CONFIG.email}`,
];

schreibeMd('/', zeilen);

schreibeMd('/preise', [
  '# Reparatur-Preise – Phone Doctor Frankfurt',
  '',
  'Unverbindliche Richtpreise (Stand August 2026), je nach Ersatzteil-Qualität. Preisrechner: ' + url('/preise'),
  '',
  ...zeilen.slice(zeilen.indexOf('## Reparaturpreise nach Modell') + 4),
  '',
  ...kontaktMd,
]);

for (const s of REPARATUR_SEITEN) {
  const modelle = modelleFuer(s);
  schreibeMd(`/reparatur/${s.slug}`, [
    `# ${s.h1}`,
    '',
    ...s.intro.flatMap((a) => [a, '']),
    s.marken,
    '',
    '## Häufige Schäden und Preise',
    '',
    ...s.probleme.map((p) => {
      const ab = abPreisFuer(modelle, p.kategorie);
      return `- **${p.titel}** (${ab !== null ? `ab ${ab} €` : 'Preis nach Diagnose'}): ${p.text}`;
    }),
    '',
    '## Häufige Fragen',
    '',
    ...s.faqs.flatMap((f) => [`### ${f.frage}`, '', f.antwort, '']),
    ...(modelle.length
      ? ['## Preise nach Modell', '', ...modelle.map((m) => `- [${anzeigeName(m)}](${url(`/preise/${modellSlug(m)}`)})`), '']
      : []),
    ...kontaktMd,
  ]);
}

for (const m of PRICE_DATA) {
  const name = anzeigeName(m);
  schreibeMd(`/preise/${modellSlug(m)}`, [
    `# ${name} Reparatur in Frankfurt – Preise`,
    '',
    `Reparaturpreise von Phone Doctor Frankfurt für das ${name}. Unverbindliche Richtpreise (Stand August 2026).`,
    '',
    ...Object.entries(m.repairs).flatMap(([k, eintraege]) => [
      `## ${label(k)}`,
      '',
      ...eintraege.map((e) => `- ${qualitaet(e.q)}: ${e.q === 'ab' ? 'ab' : 'ca.'} ${e.p} €`),
      '',
    ]),
    ...kontaktMd,
  ]);
}

schreibeMd('/faq', [
  '# Häufige Fragen zur Handy-Reparatur in Frankfurt',
  '',
  ...FAQS.flatMap((f) => [`## ${f.frage}`, '', f.antwort, '']),
  ...kontaktMd,
]);

schreibeMd('/kontakt', ['# Kontakt – Phone Doctor Frankfurt', '', ...kontaktMd.slice(2)]);

writeFileSync(
  resolve(gen, 'preise.json'),
  JSON.stringify(
    PRICE_DATA.map((m) => ({
      modell: anzeigeName(m),
      url: url(`/preise/${modellSlug(m)}`),
      reparaturen: Object.entries(m.repairs).map(([k, eintraege]) => ({
        reparatur: label(k),
        preise: eintraege.map((e) => ({ qualitaet: qualitaet(e.q), euro: e.p })),
      })),
    })),
  ),
);

console.log(`SEO-Dateien erzeugt: ${sitemapEintraege.length} Sitemap-Einträge, ${reparaturPfade.length + modellPfade.length} Prerender-Routen.`);
