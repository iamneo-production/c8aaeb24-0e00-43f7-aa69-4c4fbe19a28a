import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../services/home-api.service';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
	public productList: any;
	public token: any = localStorage.getItem('token');
	public ans: any = '';
	public productName: string = ' ';
	public res: any;
	@Input() deviceXs: boolean = false;
	constructor(
		private api: HomeApiService,
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.api.getProduct().subscribe((res: any) => {
			this.productList = res;
			console.log('This is an array');
			console.log(this.productList);
		});
	}
	Search(product: string) {
		if (product == '') {
			this.ngOnInit();
		} else {
			// this.productList = this.productList.filter((res: any) => {
			// 	if (
			// 		res.productName
			// 			.toLocaleLowerCase()
			// 			.match(this.productName.toLocaleLowerCase())
			// 	) {
			// 		return res;
			// 	}
			// 	// return res.productName
			// 	// 	.toLocaleLowerCase()
			// 	// 	.match(this.productName.toLocaleLowerCase());
			// });
			// console.log('Here ' + this.productList.length());
			this.res = this.productList.forEach((element: any) => {
				// console.log(element);
				if (
					new String(element.productName.toLowerCase()).valueOf() ===
					new String(product.toLowerCase()).valueOf()
				) {
					console.log(element);
					return element;
				}
			});
			if (this.res == null) {
				console.log(0);
			} else console.log('Search completed: ' + this.res.length());
		}
	}
}
