import { Injectable, signal } from '@angular/core';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // http = inject(HttpClient);

  apiUrl = 'https://nettuts.hu/jms/joe/products';

  list = signal<Product[]>([]);

  async load(): Promise<void> {
    const response = await fetch(this.apiUrl);
    const list = await response.json();
    this.list.set(list);
    // this.http.get<Product[]>(this.apiUrl).subscribe(list => {
    //   this.list.set(list)
    // });
  }

}
