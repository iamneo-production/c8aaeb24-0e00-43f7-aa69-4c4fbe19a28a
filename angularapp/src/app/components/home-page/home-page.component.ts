import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../services/home-api.service';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartdialogComponent } from '../cartdialog/cartdialog.component';
import { AddCart } from 'src/app/model/addcart';
import { HttpClient } from '@angular/common/http';
import { NbWindowService } from '@nebular/theme';
import { AddtocartComponent } from '../addtocart/addtocart.component';

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
	public jwt: any;
	public time: any;
	public cartItem: any;
	public username: any;
	public role: any;
	public mobile: any;
	public active: any;
	public email: any;
	@Input() deviceXs: boolean = false;
	constructor(
		private api: HomeApiService,
		private router: Router,
		private notificationService: NotificationService,
		private dialog: MatDialog,
		private http: HttpClient,
		private windowService: NbWindowService
	) {}

	ngOnInit(): void {
		this.token = localStorage.getItem('token');
		this.jwt = jwt_decode(this.token);
		this.username = this.jwt.sub;
		this.role = this.jwt.roles[0];
		if (this.username) {
			this.username =
				this.username[0].toUpperCase() + this.username.substring(1);
		}
		if (this.role) {
			this.role = this.role[0].toUpperCase() + this.role.substring(1);
		}
		this.time = new Date().getTime();
		// console.log(this.jwt.exp * 1000, this.time);
		// if (Date.now() >= this.jwt.exp * 1000) {
		// 	console.log(false);
		// } else {
		// 	console.log(true);
		// }
		if (this.jwt == null || this.jwt.exp * 100 > this.time) {
			localStorage.removeItem('token');
			console.log('Token expired');
			this.router.navigate(['/login']);
		} else {
			console.log('Token not expired');
		}

		// console.log('Home ' + localStorage.getItem('token'));
		this.api.getProduct().subscribe((res: any) => {
			this.productList = res;
			console.log('This is an array');
			// console.log(this.productList);
		});

		this.http
			.get(`http://localhost:8080/user/info/${this.jwt.user_id}`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
			.subscribe((data: any) => {
				this.email = data.email;
				this.active = data.active;
				this.mobile = data.mobileNumber;
			});
	}

	addToLocal(item: any) {
		localStorage.setItem('current_ordered_item', JSON.stringify(item));
		this.router.navigate(['/view/' + item.productId]);
	}

	addToCart(item: any) {
		localStorage.setItem('cart_item', JSON.stringify(item));

		this.cartItem = new AddCart();
		this.cartItem.productId = item.productId;
		this.cartItem.quantity = '1';
		this.api.addcart(this.cartItem).subscribe((data: any) => {
			this.notificationService.notify(
				'Success',
				NotificationType.SUCCESS,
				'bottom-right',
				'Item added to the cart'
			);
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
