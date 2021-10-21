import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { login } from 'src/app/model/login';
import { NotificationType } from 'src/app/notification-type.enum';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthOtpComponent } from '../auth-otp/auth-otp.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NbDialogService } from '@nebular/theme';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	@Input() deviceXs: boolean = false;
	testPassword: any;

	constructor(
		private loginservice: LoginService,
		private router: Router,
		private dialog: MatDialog,
		private notificationService: NotificationService,
		private dialogService: NbDialogService
	) {}

	pass: any = '';
	show: boolean = false;
	Login: login = new login();
	token: string = '';
	testEmail: any = '';
	ngOnInit(): void {
		if (!!localStorage.getItem('token')) {
			this.token = localStorage.getItem('token') || '{}';
			try {
				this.ans = jwt_decode(this.token);
			} catch (Error) {
				this.router.navigate(['/login']);
			}
			if (this.ans.roles[0] == 'admin') {
				this.router.navigate(['/admin']);
			} else if (this.ans.roles[0] == 'user') {
				this.router.navigate(['/home']);
			}
		} else {
			this.router.navigate(['/login']);
		}
	}

	showPassword() {
		this.show = !this.show;
	}

	ans: any;
	go_login() {
		// const regex = /\S+@\S+\.\S+/;
		// this.testEmail = login.email;
		// this.testPassword = login.password;
		// if (this.testPassword < 6 || !regex.test(this.testEmail)) {
		// 	this.notificationService.notify(
		// 		NotificationType.ERROR,
		// 		'Validation failed'
		// 	);
		// 	return;
		// }
		this.loginservice.createLogin(this.Login).subscribe(
			(data: any) => {
				console.log(data);
				if (data.result == false) {
					this.notificationService.notify(
						'Error',
						NotificationType.DANGER,
						'bottom-right',
						data.message
					);
					console.log('hooo');
				} else if (
					data.result == true &&
					data.message === 'Needed two step verification'
				) {
					this.notificationService.notify(
						'Info',
						NotificationType.INFO,
						'bottom-right',
						'Enter OTP for validation'
					);
					this.onCreate(this.Login.email, this.Login.password);
				} else {
					localStorage.setItem('token', data.message);
					console.log('Success');
					try {
						console.log(data.message);
						this.ans = jwt_decode(data.message);
					} catch (Error) {
						this.ans = null;
					}
					// console.log(this.ans);
					this.notificationService.notify(
						'Success',
						NotificationType.SUCCESS,
						'bottom-right',
						'Login Successful'
					);
					this.notificationService.notify(
						'Succes',
						NotificationType.SUCCESS,
						'bottom-right',
						'Welcome!'
					);
					console.log(this.ans);
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
		// this.dialogService.open(ForgotPasswordComponent, {});
	}
}
