import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { ProductTableItem } from './product_table';
@Injectable({
  providedIn: 'root'
})
export class ProductTableService {
  private baseURL = "http://localhost:8080/admin";
  constructor(private httpClient: HttpClient) { }
  getEmployeesList(): Observable<ProductTableItem[]>{
    return this.httpClient.get<ProductTableItem[]>(`${this.baseURL}`);
  }
  deleteEmployee(id: any): Observable<Object>{
    return this.httpClient.get<Object>(`${"http://localhost:8080/admin/delete"}/${id[0]}`);
  }
  getEmployeeById(id: any): Observable<ProductTableItem>{
    return this.httpClient.get<ProductTableItem>(`${"http://localhost:8080/admin/productEdit"}/${id[0]}`);
  }
  updateEmployee(id: any, employee: ProductTableItem): Observable<Object>{
    console.log(employee);
    return this.httpClient.post(`${"http://localhost:8080/admin/productEdit"}/${id[0]}`, employee);
  }
}
