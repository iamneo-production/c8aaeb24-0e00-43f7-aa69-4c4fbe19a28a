import { Injectable } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../notification-type.enum';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	constructor(private notifier: NbToastrService) {}
	public notify(
		add: string,
		status: NbComponentStatus,
		position: any,
		message: string
	) {
		this.notifier.show(add, message, { status, position });
	}
}
