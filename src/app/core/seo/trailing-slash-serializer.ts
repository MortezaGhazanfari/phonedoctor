import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Hostinger leitet Seitenadressen ohne Schrägstrich am Ende per 301 um. Interne Links
 * sollen direkt auf die Zieladresse zeigen, sonst werten Crawler sie als Weiterleitung.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override serialize(tree: UrlTree): string {
    const url = super.serialize(tree);
    const trenner = url.search(/[?#]/);
    const pfad = trenner === -1 ? url : url.slice(0, trenner);
    const rest = trenner === -1 ? '' : url.slice(trenner);
    if (pfad.endsWith('/') || /\.[a-z0-9]+$/i.test(pfad)) {
      return url;
    }
    return `${pfad}/${rest}`;
  }
}
