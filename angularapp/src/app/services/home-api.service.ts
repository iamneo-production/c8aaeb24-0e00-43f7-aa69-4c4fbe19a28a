import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCart } from '../model/addcart';
import jwt_decode from 'jwt-decode';
import { ProductTableItem } from '../model/product_table';
import { reports } from '../components/cart/cart.component';
import { reports_order } from '../components/my-order/my-order.component';

@Injectable({
	providedIn: 'root',
})
export class HomeApiService {
	constructor(private http: HttpClient) {}

	getProduct() {
		let token = localStorage.getItem('token');
		// console.log(token);
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		return this.http.get<any>('http://localhost:8080/home', { headers }).pipe(
			map((res: any) => {
				return res;
			})
		);
	}
	// getProductDetail(id: any): Observable<ProductTableItem>{
	//   return this.http.get<ProductTableItem>(`${"http://localhost:8080/admin/productEdit"}/${id}`);
	// }
	addcart(data: AddCart) {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		let token_dec = localStorage.getItem('token') || '{}';
		let ans: any;
		try {
			ans = jwt_decode(token_dec);
		} catch (Error) {
			ans = null;
		}
		return this.http.post(
			`${'http://localhost:8080/home'}/${ans.user_id}`,
			data,
			{ headers }
		);
	}
	DeleteItemFromCart(var_del: AddCart): Observable<Object> {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		return this.http.post<Object>(
			`${'http://localhost:8080/cart/delete'}`,
			var_del,
			{ headers }
		);
	}

	PlaceAllItemsInCart() {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		return this.http.get<Object>(`${'http://localhost:8080/saveOrder'}`, {
			headers,
		});
	}

	getallorder(): Observable<reports_order[]> {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		return this.http.get<reports_order[]>(`${'http://localhost:8080/orders'}`, {
			headers,
		});
	}
	placeitem(var_pl: AddCart): Observable<Object> {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		return this.http.post<Object>(
			`${'http://localhost:8080/placeOrder'}`,
			var_pl,
			{ headers }
		);
	}
	GetProductsFromCart(): Observable<reports[]> {
		let token = localStorage.getItem('token');
		let headers: HttpHeaders = new HttpHeaders().set(
			'Authorization',
			'Bearer ' + token
		);
		let token_dec = localStorage.getItem('token') || '{}';
		let ans: any;
		try {
			ans = jwt_decode(token_dec);
		} catch (Error) {
			ans = null;
		}
		return this.http.get<reports[]>(
			`${'http://localhost:8080/cart'}/${ans.user_id}`,
			{ headers }
		);
	}
}
