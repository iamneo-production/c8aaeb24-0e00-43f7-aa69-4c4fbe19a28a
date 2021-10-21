import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
	constructor(
		private http: HttpClient,
		public toastrService: NbToastrService
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
	token: any = localStorage.getItem('token');

	ngOnInit(): void {}
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
		this.mail = this.resetCodeEmail;
		this.mail = this.mail.split(',');
		console.log(this.mail);
		this.token = localStorage.getItem('token');
		console.log(this.token);
		this.body = 'Testing mail';
		this.subject = 'Email Testing - Virtusa';
		this.http
			.post(
				this.api,
				{
					emails: this.mail,
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

	showToast(
		add: any,
		status: NbComponentStatus,
		position: any,
		message: string
	) {
		this.toastrService.show(add, message, { status, position });
	}
}
