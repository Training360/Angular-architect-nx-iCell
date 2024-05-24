import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);

  apiUrl = process.env['NX_API_URL'] || '';

  list$ = new BehaviorSubject<Product[]>([]);

  load(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe(list => {
      this.list$.next(list);
    });
  }

}
