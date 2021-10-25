import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { reports } from '../components/user/cart/cart.component';
import { reports_order } from '../components/user/my-order/my-order.component';
import { AddCart } from '../model/addcart';

@Injectable({
	providedIn: 'root',
})
export class UserApiService {
	token: any = localStorage.getItem('token');
	decodedToken: any;
	email: any;
	user_id: any;
	base_url: string = 'http://localhost:8080';
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

	getHomeProducts() {
		return this.http.get<any>(this.base_url + '/home').pipe(
			map((res: any) => {
				return res;
			})
		);
	}

	addItemToCart(data: AddCart) {
		return this.http.post(`${this.base_url}/home/${this.user_id}`, data);
	}

	deleteItemFromCart(data: AddCart): Observable<Object> {
		return this.http.post<Object>(`${this.base_url}/cart/delete`, data);
	}

	saveOrder() {
		return this.http.get(`${this.base_url}/saveOrder`);
	}

	getOrders() {
		return this.http.get<reports_order[]>(`${this.base_url}/orders`);
	}

	placeOrder(data: AddCart): Observable<Object> {
		return this.http.post<Object>(`${this.base_url}/placeOrder`, data);
	}

	getProductsFromCart(): Observable<reports[]> {
		return this.http.get<reports[]>(`${this.base_url}/cart/${this.user_id}`);
	}

	store(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	get nativeWindow(): any {
		return _window();
	}
}

function _window(): any {
	return window;
}
