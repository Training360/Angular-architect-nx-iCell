import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from './service/product.service';

@Component({
  standalone: true,
  imports: [ RouterModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'nx-env';

  productService = inject(ProductService);

  products = this.productService.list;

  ngOnInit(): void {
    this.productService.load();
  }

}
