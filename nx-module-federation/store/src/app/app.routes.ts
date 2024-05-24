import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'checkout',
    loadChildren: () => import('checkout/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'product',
    loadChildren: () => import('product/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
