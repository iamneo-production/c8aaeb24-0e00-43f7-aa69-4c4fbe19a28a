import { Component, OnInit } from '@angular/core';
import { signup } from '../../model/signup';
import { SignupService } from '../../services/signup.service';
import { Router } from '@angular/router';

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
	Signup: signup = new signup();
	emailinvalid: Boolean = false;
	mobileinvalid: Boolean = false;
	useralready: Boolean = false;
	qrShow: Boolean = false;
	constructor(
		private signupservice: SignupService,
		private router: Router,
		private dialog: MatDialog,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {}
	go_signup() {
		this.signupservice.createSignup(this.Signup).subscribe(
			(data: any) => {
				console.log(data);
				console.log(this.Signup);
				if (data.result == true && this.Signup.mfa == false) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						data.message
					);
					this.goToLogin();
				} else if (data.result == true && this.Signup.mfa == true) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Scan the QR code for setup'
					);
					this.onCreate(data.message);
				} else {
					data.errors.forEach((ele: string) => {
						this.notificationService.notify(NotificationType.ERROR, ele);
					});

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
	}
	onSubmit() {
		console.log(this.Signup);
		this.go_signup();
	}
	goToLogin() {
		this.router.navigate(['/login']);
	}
	goToSignup() {
		this.router.navigate(['/signup']);
	}
	onCreate(qrcode: string) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
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
}
