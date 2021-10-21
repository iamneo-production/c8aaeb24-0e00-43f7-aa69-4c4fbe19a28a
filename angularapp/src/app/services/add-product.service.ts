import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { addProduct } from '../model/addProduct';

@Injectable({
	providedIn: 'root',
})
export class AddProductService {
	private baseURL = 'http://localhost:8080/admin/addProduct';

	constructor(private httpClient: HttpClient) {}

	addProd(addproduct: addProduct): Observable<Object> {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		return this.httpClient.post(`${this.baseURL}`, addproduct, { headers });
	}
}
