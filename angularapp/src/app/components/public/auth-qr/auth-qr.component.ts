import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationType } from '../../../services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-auth-qr',
	templateUrl: './auth-qr.component.html',
	styleUrls: ['./auth-qr.component.css'],
})
export class AuthQrComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<AuthQrComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpClient,
		private notificationService: NotificationService,
		private router: Router
	) {}

	otp = '';
	qrcode = this.data.qrcode;
	email = this.data.email;
	password = this.data.password;
	add: any = this.data.add;

	ngOnInit(): void {}

	verify() {
		this.http
			.post('http://localhost:8080/verify/' + this.otp, {
				email: this.email,
				password: this.password,
			})
			.subscribe((data: any) => {
				if (data.status == 200) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'OTP validation successful'
					);
					if (this.add) {
						this.notificationService.notify(
							NotificationType.SUCCESS,
							'Login successful'
						);
						localStorage.setItem('token', data.message);
						this.router.navigate(['/home']);
						this.dialogRef.close();
					} else {
						this.notificationService.notify(
							NotificationType.SUCCESS,
							'Logout successful'
						);
						localStorage.removeItem('token');
						this.router.navigate(['/login']);
						this.dialogRef.close();
					}
				} else {
					this.notificationService.notify(
						NotificationType.DANGER,
						data.message
					);
				}
			});
	}
}
