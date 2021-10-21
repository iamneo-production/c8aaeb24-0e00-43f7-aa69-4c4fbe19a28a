// import { AfterViewInit, Component, ViewChild,Input } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTable } from '@angular/material/table';
// import { OrderTableAdminDataSource, OrderTableAdminItem } from './order-table-admin-datasource';

// @Component({
//   selector: 'app-order-table-admin',
//   templateUrl: './order-table-admin.component.html',
//   styleUrls: ['./order-table-admin.component.css']
// })
// export class OrderTableAdminComponent implements AfterViewInit {
//   @Input() deviceXs: boolean = false;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatTable) table!: MatTable<OrderTableAdminItem>;
//   dataSource: OrderTableAdminDataSource;

//   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
//   displayedColumns = ['id', 'uid','bname','price','quant'];

//   constructor() {
//     this.dataSource = new OrderTableAdminDataSource();
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
import { ProductTableService } from '../../services/product-table.service';
@Component({
	selector: 'app-order-table-admin',
	templateUrl: './order-table-admin.component.html',
	styleUrls: ['./order-table-admin.component.css'],
})
export class OrderTableAdminComponent implements OnInit {
	@Input() deviceXs: boolean = false;

	public productList: any;
	ELEMENT_DATA: admin_reports[] = [];
	displayedColumns: string[] = ['id', 'uid', 'bname', 'price', 'quant'];
	dataSource = new MatTableDataSource<admin_reports>(this.ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true })
	paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true })
	sort: MatSort = new MatSort();
	isempty: boolean = false;

	constructor(private service: ProductTableService) {}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.getallorder_admin();
	}

	public getallorder_admin() {
		this.service.getallorderadmin().subscribe((data: any) => {
			this.dataSource.data = data as admin_reports[];
			if (data.length == 0) {
				this.isempty = true;
			}
			console.log(data);
		});
		//   let resp=this.service.getProduct();
		//   resp.subscribe(report=>this.dataSource.data=report as reports[])
	}
}
export interface admin_reports {
	orderId: string;
	userId: string;
	quantity: string;
	totalPrice: string;
	status: string;
	price: string;
	prodcutName: string;
}
