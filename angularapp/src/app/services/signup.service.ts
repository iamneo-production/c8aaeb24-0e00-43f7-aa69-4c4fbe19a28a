import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { signup } from '../model/signup';
@Injectable({
	providedIn: 'root',
})
export class SignupService {
	private baseURL = 'http://localhost:8080/signup';

	constructor(private httpClient: HttpClient) {}

	createSignup(Signup: signup): Observable<Object> {
		return this.httpClient.post(`${this.baseURL}`, Signup);
	}
}
