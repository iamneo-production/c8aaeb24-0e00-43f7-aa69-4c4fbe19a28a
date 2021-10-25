import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import jwtDecode from 'jwt-decode';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthQrComponent } from '../../../components/public/auth-qr/auth-qr.component';

@Component({
	selector: 'app-dashboard-user',
	templateUrl: './dashboard-user.component.html',
	styleUrls: ['./dashboard-user.component.css'],
})
export class DashboardUserComponent implements OnInit {
	constructor(
		private http: HttpClient,
		public toastrService: NbToastrService,
		private notificationService: NotificationService,
		private dialog: MatDialog,
		private router: Router,
		private title: Title
	) {
		this.title.setTitle('EBook Store - Support');
	}
	disableEmail: any = '';
	enableEmail: any = '';
	mfaEmail: any = '';
	resetCodeEmail: any = '';
	sendEmail: any = '';
	checkEmail: any = '';
	body: any = '';
	subject: any = '';
	api = '';
	mail: any = '';
	emailMail: any = '';
	messages: any;
	token: any = localStorage.getItem('token');
	jwt: any = '';
	pass: any = '';

	ngOnInit(): void {}
	transactions: any = [
		['Transaction 1', 'user1@gmail.com', '50.00', '21-10-2021'],
		['Transaction 2', 'user2@gmail.com', '60.00', '22-10-2021'],
		['Transaction 3', 'user3@gmail.com', '70.00', '23-10-2021'],
		['Transaction 4', 'user4@gmail.com', '80.00', '24-10-2021'],
		['Transaction 5', 'user5@gmail.com', '90.00', '25-10-2021'],
	];

	sendMail() {
		this.api = 'http://localhost:8080/mail';
		if (this.body == '') {
			this.notificationService.notify(
				NotificationType.DANGER,
				'Body is empty.'
			);
			return;
		}
		if (this.subject == '') {
			this.notificationService.notify(
				NotificationType.SUCCESS,
				'Deafult subject will be sent'
			);
		}
		this.emailMail = this.emailMail.split(',');
		let temp: any[] = [];
		if (this.emailMail == '') {
			this.notificationService.notify(
				NotificationType.SUCCESS,
				'The mail will be sent to all users'
			);
		} else {
			this.emailMail.forEach((e: string) => {
				temp.push(e.trim());
			});
		}
		this.token = localStorage.getItem('token');
		this.http
			.post(
				this.api,
				{
					emails: temp,
					body: this.body,
					subject: this.subject,
				},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
			.subscribe((data: any) => {
				if (data.result == true)
					this.notificationService.notify(
						NotificationType.SUCCESS,
						data.message
					);
				else
					this.notificationService.notify(
						NotificationType.DANGER,
						data.message
					);
			});
	}

	enable() {
		this.api = 'http://localhost:8080/user/activatemfa';
		this.token = localStorage.getItem('token') || '{}';
		this.jwt = jwtDecode(this.token);
		if (this.jwt == null) {
			this.notificationService.notify(NotificationType.DANGER, 'Token invalid');
			this.router.navigate(['/login']);
			return;
		} else {
			this.http
				.post(
					this.api,
					{
						email: this.jwt.sub,
						password: this.pass,
					},
					{
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					}
				)
				.subscribe((data: any) => {
					if (data.result == true) {
						this.notificationService.notify(
							NotificationType.SUCCESS,
							'Scan QR to complete the setup'
						);
						this.onCreate(data.message);
					} else {
						this.notificationService.notify(
							NotificationType.DANGER,
							data.message
						);
					}
				});
		}
	}

	onCreate(qrcode: any) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.closeOnNavigation = false;
		this.dialog.open(AuthQrComponent, {
			height: '80%',
			width: '50%',
			data: {
				qrcode: qrcode,
				email: this.enableEmail,
				password: this.pass,
				add: true,
			},
		});
	}

	sendTOTP() {}

	showToast(
		add: any,
		status: NbComponentStatus,
		position: any,
		message: string
	) {
		this.toastrService.show(add, message, { status, position });
	}

	sendMessage() {
		this.jwt = jwtDecode(this.token);
		this.http
			.post(
				'http://localhost:8080/user/message',
				{
					userEmail: this.jwt.sub,
					body: this.body,
					subject: this.subject,
				},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Message sent to admin'
					);
				} else {
					this.notificationService.notify(
						NotificationType.DANGER,
						'Your request cannot be processed'
					);
				}
			});
	}
}
