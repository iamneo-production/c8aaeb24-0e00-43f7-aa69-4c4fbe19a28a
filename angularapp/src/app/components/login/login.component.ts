import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { login } from 'src/app/model/login';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { LoginService } from '../../apis/login.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthOtpComponent } from '../../components/public/auth-otp/auth-otp.component';
import { ForgotPasswordComponent } from '../../components/public/forgot-password/forgot-password.component';
import { FormValidatorsService } from '../../services/formvalidators/formvalidators.service';
import { Meta, Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

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
		public formValidators: FormValidatorsService,
		private title: Title,
		private meta: Meta
	) {
		this.title.setTitle('EBook Store - Login');
	}

	pass: any = '';
	show: boolean = false;
	Login: login = new login();
	token: string = '';
	testEmail: any = '';
	errors: any = [];
	submitted: boolean = false;
	showMessages: any = [];
	emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
	loginForm = this.formValidators.loginForm;
	@ViewChild('myNgForm') myNgForm: any;
	ngOnInit(): void {
		this.myNgForm.resetForm();
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
				NotificationType.DANGER,
				'Email address in not valid'
			);
			return;
		} else if (this.loginForm.get('password')?.invalid) {
			this.notificationService.notify(
				NotificationType.DANGER,
				'Password should have 6 to 20 characters only'
			);
			return;
		}
		this.loginservice.createLogin(this.Login).subscribe((data: any) => {
			if (data.result == false) {
				this.notificationService.notify(NotificationType.DANGER, data.message);
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
				try {
					this.ans = jwt_decode(data.message);
					localStorage.setItem('token', data.message);
				} catch (Error) {
					this.ans = null;
				}
				this.loginForm.reset();
				this.notificationService.notify(
					NotificationType.SUCCESS,
					'Login Successful'
				);
				if (this.ans.roles[0] == 'admin') {
					this.router.navigate(['/admin']);
				} else if (this.ans.roles[0] == 'user') {
					this.router.navigate(['/home']);
				}
			}
		});
	}
	onSubmit() {}
	toHome(token: string) {
		this.router.navigate(['/home']);
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
