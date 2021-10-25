import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationType } from '../../../services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { AdminApiService } from '../../../apis/admin-api.service';

@Component({
	selector: 'app-product-table',
	templateUrl: './product-table.component.html',
	styleUrls: ['./product-table.component.css'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
			),
		]),
	],
})
export class ProductTableComponent implements OnInit {
	@Input() deviceXs: boolean = false;
	panelOpenState = false;
	expandedElement!: reports | null;
	resp: any;

	public productList: any;
	ELEMENT_DATA: reports[] = [];
	displayedColumns: string[] = ['imageUrl', 'productName', 'price', 'quantity'];
	rColumns: string[] = ['', 'Product Name', 'Price', 'Quantity'];
	dataSource = new MatTableDataSource<reports>(this.ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true })
	paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true })
	sort: MatSort = new MatSort();

	constructor(
		private adminApi: AdminApiService,
		private notificationService: NotificationService,
		private title: Title
	) {
		this.title.setTitle('EBook Store - Admin Products');
	}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.getAllProducts();
	}

	public getAllProducts() {
		this.adminApi.getProducts().subscribe((data: any) => {
			this.dataSource.data = data as reports[];
		});
	}

	deleteProduct(productId: any) {
		this.adminApi.deleteProduct(productId).subscribe((data: any) => {
			this.getAllProducts();
		});
		this.notificationService.notify(
			NotificationType.SUCCESS,
			'Item has been deleted'
		);
	}
}

export interface reports {
	productId: string;
	imageUrl: string;
	productName: string;
	price: string;
	description: string;
	quantity: string;
}
