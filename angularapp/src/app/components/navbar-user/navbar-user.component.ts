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
		this.notificationService.notify(
			NotificationType.SUCCESS,
			'Logged out successfully'
		);
		console.log(4);
		localStorage.removeItem('token');
		// localStorage.clear();
		this.router.navigate(['/login']);
	}
}
