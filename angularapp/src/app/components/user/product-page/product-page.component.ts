import { Component, OnInit, Input } from '@angular/core';
import { ProductTableItem } from '../../../model/product_table';
import { AddCart } from '../../../model/addcart';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { Title } from '@angular/platform-browser';
import { UserApiService } from '../../../apis/userApi.service';
@Component({
	selector: 'app-product-page',
	templateUrl: './product-page.component.html',
	styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
	id: string = '';
	productList: ProductTableItem = new ProductTableItem();
	productList1: ProductTableItem = new ProductTableItem();
	addcart!: AddCart;
	additem!: AddCart;
	description!: string;
	desList: any;
	public cartItem: any;
	@Input() deviceXs: boolean = false;

	isReadMore = true;
	hash: string = '';
	url: string = '';
	loc: string = '';
	port: string = '';
	item: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private notificationService: NotificationService,
		private title: Title,
		private userApi: UserApiService
	) {
		this.title.setTitle('EBook Store - Product Page');
	}

	ngOnInit(): void {
		this.port = new URL(window.location.href).port;
		this.hash = new URL(window.location.href).hash;
		this.url = this.hash.slice(this.hash.lastIndexOf('/') + 1);
		this.id = this.route.snapshot.params['id'];
		this.item = JSON.parse(
			localStorage.getItem('current_ordered_item') || '{}'
		);
		this.productList = this.item;
	}

	showText() {
		this.isReadMore = !this.isReadMore;
	}

	onaddcart(item: any) {
		this.cartItem = new AddCart(item.productId, '1');
		this.userApi.addItemToCart(this.cartItem).subscribe((data: any) => {
			if (data.productId) {
				this.notificationService.notify(
					NotificationType.SUCCESS,
					'Item added to the cart'
				);
			} else {
				this.notificationService.notify(
					NotificationType.DANGER,
					'Error while adding item to the cart'
				);
			}
		});
	}

	placeitem(productList: any) {
		console.log(productList);
		localStorage.setItem('current_ordered_item', JSON.stringify(this.item));
		localStorage.setItem('pay', 'true');
		this.additem = new AddCart(productList.productId, productList.quantity);
		this.router.navigate(['/checkout']);
	}

	see(data: any) {
		this.loc = 'http://localhost:' + this.port + '/view/' + data.productId;
		window.location.href = this.loc;
		window.location.reload();
	}
}
