
src/app/
  core/                // nur einmal im ganzen Projekt
    layout/            // Header, Footer, Shell/Layout-Komponente
    services/          // global: AuthService, ApiHttpService, ToastService...
    guards/            // AuthGuard, RoleGuard
    interceptors/      // Auth-Interceptor (JWT an Requests hängen)
  shared/              // wiederverwendbare Dinge
    components/        // Button, Card, Dialog, FormControls, Modals
    pipes/
    directives/
  features/
    home/              // Startseite
    reparatur/         // Reparatur-spezifische Seiten
      smartphone/
      tablet/
      ...
    auth/              // Login, Register, Passwort vergessen
    account/           // Profil, eigene Reparaturen, Rechnungen
    admin/             // Admin-Bereich (User verwalten, Preise, Filialen)
  app.routes.ts
  app.component.ts
  app.component.html
