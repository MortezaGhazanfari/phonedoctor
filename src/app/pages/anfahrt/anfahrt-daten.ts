// Inhalte der Anfahrtsseite - auch von scripts/generate-seo-files.mjs für llms.txt und Markdown genutzt.

export const ROUTE_GOOGLE =
  'https://www.google.com/maps/dir/?api=1&destination=Phone+Doctor%2C+Borsigallee+37%2C+60388+Frankfurt+am+Main';
export const ROUTE_APPLE = 'https://maps.apple.com/?daddr=Borsigallee+37,+60388+Frankfurt+am+Main';

export const ANFAHRT_LAGE =
  'Phone Doctor liegt in der Borsigallee 37 in Frankfurt-Bergen-Enkheim, direkt gegenüber dem Hessen-Center auf der anderen Straßenseite. Wichtig: Unser Laden ist nicht im Einkaufszentrum selbst – vom Hessen-Center sind es nur ein paar Schritte zu uns.';

export const ANFAHRT_WEGE: { titel: string; text: string }[] = [
  {
    titel: 'Mit der U-Bahn',
    text: 'Mit der U7 bis zur Haltestelle „Hessen-Center“. Von dort sind es nur wenige Schritte bis zu uns in die Borsigallee 37.',
  },
  {
    titel: 'Mit dem Auto',
    text: 'Über die A66, Ausfahrt Frankfurt-Bergen-Enkheim. Der Laden liegt direkt an der Borsigallee, gegenüber dem Hessen-Center.',
  },
];

export const STADTTEILE = ['Bergen-Enkheim', 'Seckbach', 'Fechenheim', 'Riederwald', 'Bornheim', 'Ostend'];
export const UMLAND = ['Maintal', 'Bad Vilbel', 'Offenbach am Main'];
