import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
// import { MailComponent } from '../mail/mail.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MailComponent } from '../mail/mail.component';
@Component({
	selector: 'app-navbar-admin',
	templateUrl: './navbar-admin.component.html',
	styleUrls: ['./navbar-admin.component.css'],
})
export class NavbarAdminComponent implements OnInit {
	@Input() deviceXs: boolean = false;
	constructor(
		private router: Router,
		private notificationService: NotificationService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {}
	onexit() {
		this.notificationService.notify(
			NotificationType.SUCCESS,
			'Logged out successfully'
		);
		console.log(4);
		localStorage.removeItem('token');
		// localStorage.clear();
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
