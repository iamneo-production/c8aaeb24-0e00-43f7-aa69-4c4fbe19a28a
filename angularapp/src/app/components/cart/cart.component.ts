import {
	AfterViewInit,
	Component,
	ViewChild,
	Input,
	OnInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { HomeApiService } from '../../services/home-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddCart } from '../../model/addcart';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
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
	var_del: AddCart = new AddCart();
	isempty: any;

	constructor(
		private service: HomeApiService,
		private router: Router,
		private notificationService: NotificationService
	) {
	}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.GetAllProductFromCart();
	}

	public GetAllProductFromCart() {
		this.service.GetProductsFromCart().subscribe((data) => {
			this.dataSource.data = data as reports[];
			localStorage.setItem('cart', JSON.stringify(data));
			if (data.length == 0) {
				this.isempty = true;
			} else {
				this.isempty = false;
			}
		});
	}

	DeleteItemFromCart(id: any) {
		this.var_del.productId = id;
		this.var_del.quantity = '40';
		this.service.DeleteItemFromCart(this.var_del).subscribe((data: any) => {
			this.notificationService.notify(
				'Success',
				NotificationType.SUCCESS,
				'bottom-right',
				'Item deleted from cart'
			);
			this.GetAllProductFromCart();
		});
	}

	PlaceAllItems() {
		this.router.navigate(['/checkout']);
		this.service.PlaceAllItemsInCart().subscribe((data) => {
			this.notificationService.notify(
				'Success',
				NotificationType.SUCCESS,
				'bottom-right',
				'All items in the cart are ordered'
			);
		});
	}
}
export interface reports {
	productId: string;
	productName: string;
	price: string;
	quantity: string;
}
