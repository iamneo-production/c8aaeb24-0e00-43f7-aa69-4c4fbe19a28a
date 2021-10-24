import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../services/home-api.service';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AddCart } from 'src/app/model/addcart';
import { HttpClient } from '@angular/common/http';
import Fuse from 'fuse.js';

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
		private api: HomeApiService,
		private router: Router,
		private notificationService: NotificationService,
		private http: HttpClient
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
		if (this.jwt == null || this.jwt.exp * 100 > this.time) {
			localStorage.removeItem('token');
			this.router.navigate(['/login']);
		}
		this.api.getProduct().subscribe(
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
