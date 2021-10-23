// import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTable } from '@angular/material/table';
// import { CartDataSource, CartItem } from './cart-datasource';
// import { HomeApiService } from '../../home-api.service';

// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.css']
// })
// export class CartComponent implements AfterViewInit {
//   @Input() deviceXs: boolean = false;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatTable) table!: MatTable<CartItem>;
//   dataSource: CartDataSource;

//   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
//   displayedColumns = ['name','price','quantity','actions'];

//   constructor(private api:HomeApiService) {
//     this.dataSource = new CartDataSource();
//   }

//   ngAfterViewInit(): void {
//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;
//     this.table.dataSource = this.dataSource;
//   }
// }

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
	// columns names that we want to displayed
	displayedColumns: string[] = ['name', 'price', 'quantity', 'actions'];
	dataSource = new MatTableDataSource<reports>(this.ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true })
	paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true })
	sort: MatSort = new MatSort();
	var_del: AddCart = new AddCart();
	isempty: any;

	constructor(
		// injecting all required services
		private service: HomeApiService,
		private router: Router,
		private notificationService: NotificationService
	) {
		// console.log(this.deviceXs);
	}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.GetAllProductFromCart();
	}

	public GetAllProductFromCart() {
		this.service.GetProductsFromCart().subscribe((data) => {
			this.dataSource.data = data as reports[];
			// console.log('This ' + this.dataSource.data);
			if (data.length == 0) {
				// console.log('hit');
				this.isempty = true;
			} else {
				this.isempty = false;
			}
			// console.log(data);
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
			// console.log(data);
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
			// console.log(data);
		});
	}
}
export interface reports {
	productId: string;
	productName: string;
	price: string;
	quantity: string;
}
/*export class ProductTableComponent implements AfterViewInit {
  @Input() deviceXs: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
  dataSource: ProductTableDataSource;

  displayedColumns = ['id', 'name','price','quantity','icon'];

  constructor() {
    this.dataSource = new ProductTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}*/
