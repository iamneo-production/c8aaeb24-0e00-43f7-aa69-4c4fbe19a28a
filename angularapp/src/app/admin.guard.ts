import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	canActivate(): boolean {
		return this.is_admin();
	}
	constructor(private router: Router) {}
	ans: any;
	token: any;
	public is_admin() {
		if (!!localStorage.getItem('token')) {
			this.token = localStorage.getItem('token');
		}
		try {
			this.ans = jwt_decode(this.token);
		} catch (Error) {
			this.ans = null;
		}
		if (this.ans == null) {
			this.router.navigate(['/login']);
			return false;
		}
		if (this.ans.roles[0] == 'admin') {
			return true;
		} else {
			this.router.navigate(['/home']);
			return false;
		}
	}
}
