import { DeviceModel, PRICE_DATA, PriceEntry } from './price-data';

export type GeraeteTyp = 'handy' | 'tablet' | 'smartwatch' | 'mac' | 'notebook';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function anzeigeName(m: DeviceModel): string {
  const name = m.name.replace(/^Ipad/i, 'iPad').replace(/^Macbook/i, 'MacBook');
  if (m.brand === 'Apple' || name.toLowerCase().includes(m.brand.toLowerCase())) {
    return name;
  }
  return `${m.brand} ${name}`;
}

export function modellSlug(m: DeviceModel): string {
  return slugify(anzeigeName(m));
}

export function geraeteTyp(m: DeviceModel): GeraeteTyp {
  const n = m.name.toLowerCase();
  if (n.includes('watch')) return 'smartwatch';
  if (n.includes('macbook')) return 'mac';
  if (n.includes('surface')) return n.includes('laptop') || n.includes('book') ? 'notebook' : 'tablet';
  if (n.includes('ipad') || n.includes('tab') || n.includes('mediapad') || n.includes('matepad')) return 'tablet';
  return 'handy';
}

export function findeModell(slug: string): DeviceModel | undefined {
  return PRICE_DATA.find((m) => modellSlug(m) === slug);
}

export function abPreis(eintraege?: PriceEntry[]): number | null {
  return eintraege && eintraege.length ? Math.min(...eintraege.map((e) => e.p)) : null;
}

export function abPreisFuer(modelle: DeviceModel[], kategorie: string): number | null {
  const preise = modelle
    .map((m) => abPreis(m.repairs[kategorie]))
    .filter((p): p is number => p !== null);
  return preise.length ? Math.min(...preise) : null;
}
