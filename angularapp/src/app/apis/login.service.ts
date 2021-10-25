import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { login } from '../model/login';
@Injectable({
	providedIn: 'root',
})
export class LoginService {
	private baseURL = 'http://localhost:8080/login';

	constructor(private httpClient: HttpClient) {}

	createLogin(Login: login): Observable<Object> {
		return this.httpClient.post(`${this.baseURL}`, Login);
	}
	loggedin() {
		return !!localStorage.getItem('token');
	}
}
