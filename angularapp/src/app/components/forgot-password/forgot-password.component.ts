import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
	step: number = 1;
	email: string = '';
	code: string = '';
	pass: string = '';
	conform_password: string = '';

	constructor(
		public dialogRef: MatDialogRef<ForgotPasswordComponent>,
		private http: HttpClient,
		private notificationService: NotificationService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {}

	submitMail() {
		this.http
			.post('http://localhost:8080/forgot', {
				email: this.email,
			})
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(NotificationType.INFO, data.message);
					this.onNextStep();
				} else {
					this.notificationService.notify(NotificationType.ERROR, data.message);
				}
			});
	}

	submitCode() {
		this.http
			.post('http://localhost:8080/verifyCode', {
				email: this.email,
				password: this.code,
			})
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						data.message
					);
					this.onNextStep();
				} else {
					this.notificationService.notify(NotificationType.ERROR, data.message);
				}
			});
	}

	submitPassword() {
		this.http
			.post('http://localhost:8080/savePassword', {
				email: this.email,
				password: this.pass,
				conformPassword: this.conform_password,
				code: this.code,
			})
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						data.message
					);
					this.dialogRef.close();
					this.router.navigate(['.'], { relativeTo: this.route });
				} else {
					this.notificationService.notify(NotificationType.ERROR, data.message);
				}
			});
	}

	onNextStep() {
		this.step++;
	}
}
