import { Component, OnInit, Input } from '@angular/core';
import { ProductTableItem } from '../../../model/product_table';
import { AddCart } from '../../../model/addcart';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { Title } from '@angular/platform-browser';
import { UserApiService } from '../../../apis/userApi.service';
import { MatDialog } from '@angular/material/dialog';
import { QuantityboxComponent } from '../quantitybox/quantitybox.component';
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
	public productName: any;
	public quantity: any;
	public needed: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private notificationService: NotificationService,
		private title: Title,
		private userApi: UserApiService,
		public dialog: MatDialog
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
			this.cartItem = new AddCart(item.productId, result.needed);
			this.userApi.addItemToCart(this.cartItem).subscribe((data: any) => {
				if (data.result == true) {
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

	placeitem(productList: any) {
		console.log(productList);
		localStorage.setItem('current_ordered_item', JSON.stringify(this.item));
		this.productName = productList.productName;
		this.quantity = productList.quantity;
		this.needed = 1;
		localStorage.setItem('pay', 'true');
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
			this.cartItem = new AddCart(productList.productId, result.needed);
			this.userApi.placeOrder(this.cartItem).subscribe((data: any) => {
				if (data.status == 'Ordered') {
					this.router.navigate(['/checkout']);
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Items added to orders, please conform your payment for shipping'
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

	see(data: any) {
		this.loc = 'http://localhost:' + this.port + '/view/' + data.productId;
		window.location.href = this.loc;
		window.location.reload();
	}
}
