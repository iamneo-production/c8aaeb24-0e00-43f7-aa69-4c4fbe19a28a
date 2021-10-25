import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from '../../../services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
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
		localStorage.removeItem('token');
		localStorage.clear();
		this.router.navigate(['/login']);
	}
	onClick() {
		this.router.navigate(['/admin/dashboard']);
	}
}
