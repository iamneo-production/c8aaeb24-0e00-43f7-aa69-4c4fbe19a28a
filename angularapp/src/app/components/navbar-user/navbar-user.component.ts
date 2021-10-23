import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'app-navbar-user',
	templateUrl: './navbar-user.component.html',
	styleUrls: ['./navbar-user.component.css'],
})
export class NavbarUserComponent implements OnInit {
	@Input() deviceXs: boolean = false;
	constructor(
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {}

	onexit() {
		console.log('Logout');
		// this.notificationService.notify(
		// 	'Success',
		// 	NotificationType.SUCCESS,
		// 	'bottom-right',
		// 	'Logged out successfully'
		// );
		console.log(4);
		localStorage.removeItem('token');
		localStorage.clear();
		this.router.navigate(['/login']);
	}

	onClick() {
		// const dialogConfig = new MatDialogConfig();
		// dialogConfig.disableClose = true;
		// dialogConfig.autoFocus = true;
		// this.dialog.open(MailComponent, {
		// 	height: '80%',
		// 	width: '50%',
		// 	data: {},
		// });
		this.router.navigate(['/dashboard']);
		// { height: '80%', width: '50%' });
	}
}
