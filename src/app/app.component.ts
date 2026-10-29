import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SeoService } from './core/seo/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'phonedoc_frontend';

  constructor(router: Router, seo: SeoService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        seo.clearPageJsonLd();
      }
      if (event instanceof NavigationEnd) {
        seo.setCanonical(event.urlAfterRedirects);
        let route: ActivatedRouteSnapshot = router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const description = route.data['description'];
        if (typeof description === 'string') {
          seo.setDescription(description);
        }
      }
    });
  }
}
