import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({
	providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
	constructor(private notificationService: NotificationService) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const API_KEY = '';
		try {
			let token = localStorage.getItem('token');
			return next.handle(req);
		} catch (err: any) {
			this.notificationService.notify(
				'Error',
				NotificationType.DANGER,
				'bottom-right',
				'Error talking to API'
			);
			return Observable.throw('Error');
		}
	}
}
