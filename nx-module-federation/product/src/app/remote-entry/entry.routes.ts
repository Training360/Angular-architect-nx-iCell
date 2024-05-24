import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { ProductEditorComponent } from '../page/product-editor/product-editor.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntryComponent },
  { path: 'editor', component: ProductEditorComponent },
];
