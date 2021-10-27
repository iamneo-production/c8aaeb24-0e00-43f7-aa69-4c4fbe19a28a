import { Component, OnInit, Input } from '@angular/core';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AddCart } from 'src/app/model/addcart';
import { HttpClient } from '@angular/common/http';
import Fuse from 'fuse.js';
import { Title } from '@angular/platform-browser';
import { UserApiService } from '../../../apis/userApi.service';
import { MatDialog } from '@angular/material/dialog';
import { QuantityboxComponent } from '../quantitybox/quantitybox.component';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
	public productList: any;
	public original: any;
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
	public temp: any;
	public e: any;
	public term: any;
	public value: any;
	public test: any;
	public searchItems: any;
	public quantity: any;
	public needed: any;
	options = {
		keys: [
			{
				name: 'productName',
				weight: 0.5,
			},
			{
				name: 'description',
				weight: 0.5,
			},
		],
	};
	@Input() deviceXs: boolean = false;
	constructor(
		private router: Router,
		private http: HttpClient,
		private title: Title,
		private userApi: UserApiService,
		public dialog: MatDialog,
		private notificationService: NotificationService
	) {
		this.title.setTitle('EBook Store - Home');
	}

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
		if (this.jwt == null || this.jwt.exp * 100 > this.time) {
			localStorage.clear();
			this.router.navigate(['/login']);
		}
		this.userApi.getHomeProducts().subscribe(
			(res: any) => {
				this.productList = res;
				this.original = res;
			},
			() => {},
			() => {
				for (let t = 0; t < this.productList.length; ++t) {
					this.productList[t].price = parseFloat(this.productList[t].price);
					this.productList[t].quantity = parseInt(this.productList[t].quantity);
				}
			}
		);

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
		this.cartItem = item;
		this.productName = item.productName;
		this.quantity = item.quantity;
		this.needed = 1;
		const dialogRef = this.dialog.open(QuantityboxComponent, {
			width: '20%',
			data: {
				name: this.productName,
				quantity: this.quantity,
				needed: this.needed,
			},
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result.quantity < result.needed) {
				this.notificationService.notify(
					NotificationType.DANGER,
					'Insufficient quantity'
				);
				return;
			}
			localStorage.setItem('current_ordered_item', JSON.stringify(item));
			this.cartItem = new AddCart(item.productId, result.needed);
			localStorage.setItem('pay', 'true');
			localStorage.setItem('price', (result.quantity * item.price).toString());
			this.userApi.addItemToCart(this.cartItem).subscribe((data: any) => {
				if (data.result == true) {
					localStorage.setItem('cart', JSON.stringify(this.cartItem));
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Item added to the cart'
					);
				} else {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'You have added maximum available stock to your cart'
					);
				}
			});
		});
	}
	lowToHigh() {
		this.productList.sort((a: any, b: any) => (a.price > b.price ? 1 : -1));
	}

	highToLow() {
		this.productList.sort((a: any, b: any) => (a.price < b.price ? 1 : -1));
	}

	search(target: any): void {
		let fuse = new Fuse(this.original, this.options);
		this.value = target.value;
		if (this.value == '') {
			this.productList = this.original;
		} else {
			this.searchItems = fuse.search(this.value);
			this.productList = [];
			for (let t = 0; t < this.searchItems.length; ++t) {
				this.productList.push(this.searchItems[t].item);
			}
		}
	}

	reset() {
		this.productList = this.original;
	}
}
