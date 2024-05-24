import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ProductService } from './service/product.service';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule,
    AsyncPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'nx-env';

  productService = inject(ProductService);

  products$ = this.productService.list$;

  constructor() {
    console.log('>>> NX_API_URL', process.env['NX_API_URL']);
  }

  ngOnInit(): void {
    this.productService.load();
  }

}
