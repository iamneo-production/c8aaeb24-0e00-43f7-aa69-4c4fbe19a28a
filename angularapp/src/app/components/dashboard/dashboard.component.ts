import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
	constructor(
		private http: HttpClient,
		public toastrService: NbToastrService,
		private notificationService: NotificationService
	) {}
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
	token: any = localStorage.getItem('token');
	messages: any;

	ngOnInit(): void {
		this.getMessages();
	}
	transactions: any = [
		['Transaction 1', 'user1@gmail.com', '50.00', '21-10-2021'],
		['Transaction 2', 'user2@gmail.com', '60.00', '22-10-2021'],
		['Transaction 3', 'user3@gmail.com', '70.00', '23-10-2021'],
		['Transaction 4', 'user4@gmail.com', '80.00', '24-10-2021'],
		['Transaction 5', 'user5@gmail.com', '90.00', '25-10-2021'],
	];

	check() {
		this.api = 'http://localhost:8080/checkUser';
		this.mail = this.checkEmail;
		this.http
			.post(
				this.api,
				{
					email: this.mail,
					password: '',
				},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
			.subscribe((data: any) => {
				if (data.result == true)
					this.showToast('Success', 'success', 'bottom-right', data.message);
				else this.showToast('Error', 'danger', 'bottom-right', data.message);
			});
	}

	action(msg: string) {
		if (msg === 'enable') {
			this.api = 'http://localhost:8080/enableUser';
			this.mail = this.enableEmail;
		} else {
			this.api = 'http://localhost:8080/disableUser';
			this.mail = this.disableEmail;
		}
		this.http
			.post(
				this.api,
				{
					email: this.mail,
					password: '',
				},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
			.subscribe((data: any) => {
				if (data.result == true)
					this.showToast('Success', 'success', 'bottom-right', data.message);
				else this.showToast('Error', 'danger', 'bottom-right', data.message);
			});
	}

	remove() {
		this.api = 'http://localhost:8080/removeVerification';
		this.mail = this.mfaEmail;
		this.http
			.post(
				this.api,
				{
					email: this.mail,
					password: '',
				},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
			.subscribe((data: any) => {
				if (data.result == true)
					this.showToast('Success', 'success', 'bottom-right', data.message);
				else this.showToast('Error', 'danger', 'bottom-right', data.message);
			});
	}

	reset() {
		this.api = 'http://localhost:8080/forgot';
		this.mail = this.resetCodeEmail;
		this.http
			.post(
				this.api,
				{
					email: this.mail,
					password: '',
				},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
			.subscribe((data: any) => {
				if (data.result == true)
					this.showToast('Success', 'success', 'bottom-right', data.message);
				else this.showToast('Error', 'danger', 'bottom-right', data.message);
			});
	}

	sendMail() {
		this.api = 'http://localhost:8080/mail';
		if (this.body == '') {
			this.notificationService.notify(
				'Error',
				NotificationType.DANGER,
				'bottom-right',
				'Body is empty.'
			);
			return;
		}
		if (this.subject == '') {
			this.notificationService.notify(
				'Success',
				NotificationType.SUCCESS,
				'bottom-right',
				'Deafult subject will be sent'
			);
		}
		this.emailMail = this.emailMail.split(',');
		let temp: any[] = [];
		if (this.emailMail == '') {
			this.notificationService.notify(
				'Success',
				NotificationType.SUCCESS,
				'bottom-right',
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
					this.showToast('Success', 'success', 'bottom-right', data.message);
				else this.showToast('Error', 'danger', 'bottom-right', data.message);
			});
	}

	getMessages() {
		this.api = 'http://localhost:8080/admin/messages';
		this.http
			.get(this.api, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
			.subscribe((data: any) => {
				if (data) {
					this.messages = data;
				} else
					this.showToast(
						'Error',
						'danger',
						'bottom-right',
						'There was an error getting the messages'
					);
			});
	}

	deleteMessage(messageId: string) {
		this.api = 'http://localhost:8080/admin/remove/' + messageId;
		this.http
			.get(this.api, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
			.subscribe((data: any) => {
				if (data.result == true) {
					this.showToast('Success', 'success', 'bottom-right', data.message);
					this.getMessages();
				} else this.showToast('Error', 'danger', 'bottom-right', data.message);
			});
	}
	showToast(
		add: any,
		status: NbComponentStatus,
		position: any,
		message: string
	) {
		this.toastrService.show(add, message, { status, position });
	}
}
