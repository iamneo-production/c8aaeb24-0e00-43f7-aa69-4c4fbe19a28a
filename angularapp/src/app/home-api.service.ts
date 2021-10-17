import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductTableItem } from './product_table';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  constructor(private http:HttpClient) { }

    getProduct(){
      let token = localStorage.getItem("token");
      console.log(token);
      let headers:HttpHeaders = new  HttpHeaders().set("Authorization", "Bearer " + token);
      return this.http.get<any>("http://localhost:8080/home",{headers})
      .pipe(map((res:any)=>{
        return res;
      }))
    }
    getProductDetail(id: any): Observable<ProductTableItem>{
      return this.http.get<ProductTableItem>(`${"http://localhost:8080/admin/productEdit"}/${id}`);
    }
  } 