import { Injectable } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { NotificationType } from '../notification/notification-type.enum';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	position: any;
	add: any;
	constructor(private notifier: NbToastrService) {}
	public notify(status: NbComponentStatus, message: string) {
		if (status == NotificationType.SUCCESS) {
			this.add = 'Success';
		} else if (status == NotificationType.DANGER) {
			this.add = 'Error';
		} else if (status == NotificationType.INFO) {
			this.add = 'Info';
		}
		this.position = 'bottom-right';
		this.notifier.show(this.add, message, { status, position: this.position });
	}
}
