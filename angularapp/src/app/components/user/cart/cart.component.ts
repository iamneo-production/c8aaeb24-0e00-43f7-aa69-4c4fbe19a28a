import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddCart } from '../../../model/addcart';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { Title } from '@angular/platform-browser';
import { UserApiService } from '../../../apis/userApi.service';
@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
	@Input() deviceXs: boolean = false;

	public productList: any;
	ELEMENT_DATA: reports[] = [];
	displayedColumns: string[] = ['name', 'price', 'quantity', 'actions'];
	dataSource = new MatTableDataSource<reports>(this.ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true })
	paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true })
	sort: MatSort = new MatSort();
	var_del!: AddCart;
	isempty: any;
	price: any;

	constructor(
		private router: Router,
		private notificationService: NotificationService,
		private title: Title,
		private userApi: UserApiService
	) {
		this.title.setTitle('EBook Store - Cart');
	}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.getAllProductsFromCart();
	}

	public getAllProductsFromCart() {
		this.userApi.getProductsFromCart().subscribe((data: any) => {
			this.dataSource.data = data as reports[];
			localStorage.setItem('cart', JSON.stringify(data));
			if (data.length == 0) {
				this.isempty = true;
			} else {
				this.isempty = false;
			}
		});
	}

	deleteItemFromCart(id: any) {
		this.var_del = new AddCart(id, '1');
		this.userApi.deleteItemFromCart(this.var_del).subscribe((data: any) => {
			this.notificationService.notify(
				NotificationType.SUCCESS,
				'Item deleted from cart'
			);
			this.getAllProductsFromCart();
		});
	}

	placeOrder() {
		localStorage.setItem('pay', 'true');
		this.userApi.saveOrder().subscribe((data: any) => {
			if (data.length > 0) {
				this.notificationService.notify(
					NotificationType.SUCCESS,
					'Continue to checkout to conform payment'
				);
				this.price = 0;
				for (let t = 0; t < data.length; ++t) {
					this.price += data[0].price * data[0].quantity;
				}
				localStorage.setItem('price', this.price);
				this.router.navigate(['/checkout']);
			} else {
				this.notificationService.notify(
					NotificationType.DANGER,
					'Invalid request, please add items to cart first'
				);
			}
		});
	}
}
export interface reports {
	productId: string;
	productName: string;
	price: string;
	quantity: string;
}
