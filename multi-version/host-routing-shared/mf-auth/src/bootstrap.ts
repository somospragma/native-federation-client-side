import { NgZone } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { RouterGlobalUtil } from 'micro-frontends-config-lib';

(async () => {
  const app = await createApplication({
    providers: [
      (globalThis as any).ngZone
        ? { provide: NgZone, useValue: (globalThis as any).ngZone }
        : [],
      (globalThis as any).router
        ? { provide: RouterGlobalUtil, useValue: (globalThis as any).router }
        : [],
      provideRouter(routes),
    ],
  });

  const mfAuthenticationRoot = createCustomElement(AppComponent, {
    injector: app.injector,
  });

  customElements.define('mf-auth-root', mfAuthenticationRoot);
})();
