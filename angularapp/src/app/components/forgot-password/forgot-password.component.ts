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
	loading: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<ForgotPasswordComponent>,
		private http: HttpClient,
		private notificationService: NotificationService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {}

	submitMail() {
		this.toggleLoadingAnimation();
		this.http
			.post('http://localhost:8080/forgot', {
				email: this.email,
			})
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(
						'Info',
						NotificationType.INFO,
						'bottom-right',
						data.message
					);
					this.onNextStep();
				} else {
					this.notificationService.notify(
						'Error',
						NotificationType.DANGER,
						'bottom-right',
						data.message
					);
				}
			});
		this.toggleLoadingAnimation();
	}

	submitCode() {
		this.toggleLoadingAnimation();
		this.http
			.post('http://localhost:8080/verifyCode', {
				email: this.email,
				password: this.code,
			})
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(
						'Success',
						NotificationType.SUCCESS,
						'bottom-right',
						data.message
					);
					this.onNextStep();
				} else {
					this.notificationService.notify(
						'Error',
						NotificationType.DANGER,
						'bottom-right',
						data.message
					);
				}
			});
		this.toggleLoadingAnimation();
	}

	submitPassword() {
		this.toggleLoadingAnimation();
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
						'Success',
						NotificationType.SUCCESS,
						'bottom-right',
						data.message
					);
					this.dialogRef.close();
					this.router.navigate(['.'], { relativeTo: this.route });
				} else {
					this.notificationService.notify(
						'Error',
						NotificationType.DANGER,
						'bottom-right',
						data.message
					);
				}
			});
		this.toggleLoadingAnimation();
	}

	onNextStep() {
		this.step++;
	}

	toggleLoadingAnimation() {
		this.loading = !this.loading;
		// setTimeout(() => (this.loading = false), 3000);
	}
}
