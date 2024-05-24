import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SharedComponent } from '@nx-init/shared';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    SharedComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'airfield';
}
