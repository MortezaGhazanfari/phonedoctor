import { ApplicationConfig } from '@angular/core';
import { UrlSerializer, provideRouter, withInMemoryScrolling } from '@angular/router';
import { TrailingSlashUrlSerializer } from './core/seo/trailing-slash-serializer';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(),
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ]
};
