import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { SignupService } from 'src/app/services/signup.service';
import { signup } from 'src/app/model/signup';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthQrComponent } from '../auth-qr/auth-qr.component';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
	constructor(
		private toastrService: NbToastrService,
		private router: Router,
		private signupservice: SignupService,
		private dialog: MatDialog,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		// console.log('rendered');
	}

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
			// console.log(this.Signup);
			this.signupservice.createSignup(this.Signup).subscribe(
				(data: any) => {
					// console.log(data);
					// console.log(this.Signup);
					if (data.result == true && this.Signup.mfa == false) {
						this.notificationService.notify(
							'Success',
							NotificationType.SUCCESS,
							'bottom-right',
							data.message
						);
						this.router.navigate(['/login']);
					} else if (data.result == true && this.Signup.mfa == true) {
						this.notificationService.notify(
							'Success',
							NotificationType.SUCCESS,
							'bottom-right',
							'Scan the QR code for setup'
						);
						this.onCreate(data.message);
					} else {
						this.notificationService.notify(
							'Error',
							NotificationType.DANGER,
							'bottom-right',
							data.message
						);
						// if(data.message==='Username already exists')
						// {
						//   this.useralready=true;
						// }
						// for (let i = 0; i < data.errors.length; i++) {
						//   if(data.errors[i]==="Email address is invalid")
						//   {
						//     this.emailinvalid=true;
						//   }
						//   if(data.errors[i]==="Invalid mobile number")
						//   {
						//     this.mobileinvalid=true;
						//   }
						// }
					}
				},
				(error) => console.log(error)
			);
		} else {
			this.notificationService.notify(
				'Error',
				NotificationType.DANGER,
				'bottom-right',
				'Passwords did not match'
			);
		}
		this.toggleLoading();
		// if (this.mfa) {
		//   this.dialogService.open(AuthQrComponent, {
		//     context: 'this is some additional data passed to dialog',
		//   });
		// }
	}

	onCreate(qrcode: string) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.closeOnNavigation = false;
		// dialogConfig.disableClose = false;
		console.log(dialogConfig);
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
		this.loading = !this.loading;
	}
}
