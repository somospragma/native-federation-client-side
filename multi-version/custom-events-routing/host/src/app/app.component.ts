import {
  Component,
  inject,
  NgZone,
  signal,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
  RouterState,
} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RoutingAPI, RoutingNotifier } from 'micro-frontends-config-lib';
import { Subscription } from 'rxjs';

declare var require: any;
const packageJson = require('../../package.json');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private subscription!: Subscription;

  @HostListener('document:notifyHost', ['$event'])
  onNotifyHostNavigate({ detail: { url, state } }: CustomEvent<RoutingAPI>) {
    this.router.navigate([url], { state });
  }

  isDarkMode = signal(false);
  title = signal('host');
  ngVersion = signal(packageJson.dependencies['@angular/core']);
  primeNgVersion = signal(packageJson.dependencies['primeng']);

  constructor() {
    (globalThis as any).ngZone = inject(NgZone);
  }

  ngOnInit() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        RoutingNotifier.notifyMf({
          url: event.urlAfterRedirects,
          state: this.location.getState() as RouterState,
        } as RoutingAPI);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
