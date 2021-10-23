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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	@Input() deviceXs: boolean = false;
	testPassword: any;
	loginForm = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
			Validators.email,
		]),
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(4),
			Validators.maxLength(20),
		]),
	});
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
	errors: any = [];
	submitted: boolean = false;
	showMessages: any = [];
	emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
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
		if (this.loginForm.get('email')?.invalid) {
			this.notificationService.notify(
				'Error',
				NotificationType.DANGER,
				'bottom-right',
				'Email address in not valid'
			);
			return;
		} else if (this.loginForm.get('password')?.invalid) {
			this.notificationService.notify(
				'Error',
				NotificationType.DANGER,
				'bottom-right',
				'Password should have 6 to 20 characters only'
			);
			return;
		}
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
					try {
						console.log(data.message);
						this.ans = jwt_decode(data.message);
						console.log(this.ans);
						localStorage.setItem('token', data.message);
					} catch (Error) {
						this.ans = null;
					}
					// console.log(this.ans);
					console.log(localStorage.getItem('token'));
					this.notificationService.notify(
						'Success',
						NotificationType.SUCCESS,
						'bottom-right',
						'Login Successful'
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
