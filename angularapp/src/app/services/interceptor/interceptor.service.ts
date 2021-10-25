import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Injectable({
	providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
	constructor(private notificationService: NotificationService) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const API_KEY = '9f181b49-eb75-4bf2-8030-66c80a422256';
		const token = localStorage.getItem('token');
		const modifiedReq = req.clone({
			headers: req.headers
				.set('Authorization', `Bearer ${token}`)
				.set('x-api-key', API_KEY),
		});
		try {
			return next.handle(modifiedReq);
		} catch (err: any) {
			this.notificationService.notify(
				NotificationType.DANGER,
				'Error talking to API'
			);
			return Observable.throw('Error');
		}
	}
}
