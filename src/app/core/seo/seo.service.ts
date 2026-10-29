import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL } from './seo-konstanten';

export { SITE_URL };

const PAGE_JSONLD_ATTR = 'data-page-jsonld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private title: Title,
    private meta: Meta,
  ) {}

  setTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
  }

  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  /** Hostinger leitet Adressen ohne Schrägstrich am Ende per 301 um – die kanonische Form trägt ihn deshalb immer. */
  setCanonical(path: string): void {
    const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
    const href = `${SITE_URL}${clean}/`;
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = href;
    this.meta.updateTag({ property: 'og:url', content: href });
  }

  setJsonLd(id: string, data: object): void {
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.setAttribute(PAGE_JSONLD_ATTR, '');
      this.doc.head.appendChild(script);
    }
    script.text = JSON.stringify(data);
  }

  clearPageJsonLd(): void {
    this.doc.head.querySelectorAll(`script[${PAGE_JSONLD_ATTR}]`).forEach((el) => el.remove());
  }
}
