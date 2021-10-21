import { Component, OnInit } from '@angular/core';
import { login } from '../../model/login';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthOtpComponent } from '../auth-otp/auth-otp.component';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	Login: login = new login();
	constructor(
		private loginservice: LoginService,
		private router: Router,
		private dialog: MatDialog,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {}
	ans: any;
	go_login() {
		this.loginservice.createLogin(this.Login).subscribe(
			(data: any) => {
				// console.log(data);
				if (data.result == false) {
					this.notificationService.notify(NotificationType.ERROR, data.message);
					console.log('hooo');
				} else if (
					data.result == true &&
					data.message === 'Needed two step verification'
				) {
					this.notificationService.notify(
						NotificationType.INFO,
						'Enter OTP for validation'
					);
					this.onCreate(this.Login.email, this.Login.password);
				} else {
					localStorage.setItem('token', data.message);
					console.log('Success');
					try {
						this.ans = jwt_decode(data.message);
					} catch (Error) {
						this.ans = null;
					}
					// console.log(this.ans);
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Login Successful'
					);
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Welcome, ' + this.ans.sub
					);
					if (this.ans.roles[0] == 'admin') {
						this.router.navigate(['/admin']);
					} else if (this.ans.roles[0] == 'user') {
						this.router.navigate(['/home']);
					}
				}
			},
			(error) => console.log(error)
		);
	}
	onSubmit() {
		console.log(this.Login);
		// this.go_login();
	}
	toHome(token: string) {
		// localStorage.setItem("token", token)
		this.router.navigate(['/home']);
		console.log('called');
	}
	onCreate(email: any, password: any) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		this.dialog.open(AuthOtpComponent, {
			height: '50%',
			width: '26%',
			data: {
				email: email,
				password: password,
				login: this.toHome,
			},
		});
	}

	onClick() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		this.dialog.open(ForgotPasswordComponent, { height: '38%', width: '25%' });
	}
}
