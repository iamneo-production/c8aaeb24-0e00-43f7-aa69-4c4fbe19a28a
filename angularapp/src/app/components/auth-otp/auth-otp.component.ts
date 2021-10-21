import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'app-auth-otp',
	templateUrl: './auth-otp.component.html',
	styleUrls: ['./auth-otp.component.css'],
})
export class AuthOtpComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<AuthOtpComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpClient,
		private notificationService: NotificationService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	otp = '';
	email = this.data.email;
	password = this.data.password;
	login = this.data.login;
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
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Login Successful'
					);
					localStorage.setItem('token', data.message);
					this.router.navigate(['/home']);
					// this.router.navigate(['..'], { relativeTo: this.route })
					//this.dialogRef.afterClosed().subscribe(res => { this.router.navigate(['/home']); });
					// this.router.navigate(['..'], { relativeTo: this.route })
					// this.router.navigateByUrl("/home");
					// this.login(data.message)
					this.dialogRef.close();
				} else {
					this.notificationService.notify(NotificationType.ERROR, data.message);
				}
			});
	}
}
