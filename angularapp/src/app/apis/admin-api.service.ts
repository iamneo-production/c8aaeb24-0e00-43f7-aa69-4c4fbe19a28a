import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { admin_reports } from '../components/admin/order-table-admin/order-table-admin.component';
import { addProduct } from '../model/addProduct';
import { ProductTableItem } from '../model/product_table';

@Injectable({
	providedIn: 'root',
})
export class AdminApiService {
	token: any = localStorage.getItem('token');
	decodedToken: any;
	email: any;
	user_id: any;
	base_url: string = 'http://localhost:8080/admin';
	valid: boolean = false;

	constructor(private http: HttpClient) {
		this.decodedToken = jwtDecode(this.token);
		this.email = this.decodedToken.sub;
		this.user_id = this.decodedToken.user_id;
		if (this.decodedToken == null) {
			this.valid = false;
		} else {
			this.valid = true;
		}
	}

	getProducts(): Observable<ProductTableItem[]> {
		return this.http.get<ProductTableItem[]>(`${this.base_url}`);
	}

	addProdcut(product: addProduct): Observable<Object> {
		return this.http.post(`${this.base_url}/addProduct`, product);
	}
	deleteProduct(productId: any) {
		return this.http.get<Object>(`${this.base_url}/delete/${productId}`);
	}

	getProductById(productId: any): Observable<ProductTableItem> {
		return this.http.get<ProductTableItem>(
			`${this.base_url}/productEdit/${productId}`
		);
	}

	editProductDetails(
		productId: any,
		productData: ProductTableItem
	): Observable<Object> {
		return this.http.post(
			`${this.base_url}/productEdit/${productId}`,
			productData
		);
	}

	getAllOrders(): Observable<admin_reports[]> {
		return this.http.get<admin_reports[]>(`${this.base_url}/orders`);
	}
}
