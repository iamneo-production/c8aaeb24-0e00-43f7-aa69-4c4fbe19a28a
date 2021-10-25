import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../../apis/signup.service';
import { signup } from 'src/app/model/signup';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthQrComponent } from '../../components/public/auth-qr/auth-qr.component';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from '../../services/notification/notification.service';
import { Title } from '@angular/platform-browser';
@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
	constructor(
		private router: Router,
		private signupservice: SignupService,
		private dialog: MatDialog,
		private notificationService: NotificationService,
		private title: Title
	) {
		this.title.setTitle('EBook Store - Signup');
	}

	ngOnInit(): void {}

	showPass: boolean = false;
	showConformPass: boolean = false;
	pass: string = '';
	conformPass: string = '';
	mfa: boolean = false;
	mobile: string = '';
	otp = '';
	qrcode = '';
	email = '';
	password = '';
	loading: boolean = false;
	Signup: signup = new signup();

	checkMfa() {
		this.Signup.password = this.pass;
		this.Signup.mobileNumber = this.mobile;
		this.toggleLoading();
		if (this.pass == this.conformPass) {
			this.signupservice.createSignup(this.Signup).subscribe((data: any) => {
				if (data.result == true && this.Signup.mfa == false) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						data.message
					);
					this.router.navigate(['/login']);
				} else if (data.result == true && this.Signup.mfa == true) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Scan the QR code for setup'
					);
					this.onCreate(data.message);
				} else {
					for (let t = 0; t < data.errors.length; ++t) {
						this.notificationService.notify(
							NotificationType.DANGER,
							data.errors[t]
						);
					}
				}
			});
		} else {
			this.notificationService.notify(
				NotificationType.DANGER,
				'Passwords did not match'
			);
		}
	}

	onCreate(qrcode: string) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.closeOnNavigation = false;
		this.dialog.open(AuthQrComponent, {
			height: '80%',
			width: '50%',
			data: {
				qrcode: qrcode,
				email: this.Signup.email,
				password: this.Signup.password,
			},
		});
	}

	verify() {}

	showPassword() {
		this.showPass = !this.showPass;
	}

	showConformPassword() {
		this.showConformPass = !this.showConformPass;
	}

	toggleLoading() {
		this.loading = true;
		setTimeout(() => {
			this.loading = false;
		}, 3000);
	}
}
