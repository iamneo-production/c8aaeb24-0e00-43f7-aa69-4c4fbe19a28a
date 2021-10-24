import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
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
		localStorage.removeItem('token');
		localStorage.clear();
		this.router.navigate(['/login']);
	}

	onClick() {
		this.router.navigate(['/dashboard']);
	}
}
