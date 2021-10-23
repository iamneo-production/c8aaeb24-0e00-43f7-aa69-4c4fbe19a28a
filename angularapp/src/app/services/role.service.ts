import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable({
	providedIn: 'root',
})
export class RoleService {
	auth: any = localStorage.getItem('token') || '{}';
	jwt: any = jwtDecode(this.auth);
	constructor() {}

	getRole() {
		if (this.jwt.roles[0] == 'admin') {
			return 'admin';
		} else {
			return 'user';
		}
	}
}
