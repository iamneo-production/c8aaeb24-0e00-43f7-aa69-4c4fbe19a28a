// import { AfterViewInit, Component, ViewChild,Input } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTable } from '@angular/material/table';
// import { ProductTableDataSource } from './product-table-datasource';
// import { ProductTableItem } from '../../product_table';
import { ProductTableService } from '../../services/product-table.service';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-product-table',
//   templateUrl: './product-table.component.html',
//   styleUrls: ['./product-table.component.css']
// })
// export class ProductTableComponent implements AfterViewInit {

//   @Input() deviceXs: boolean = false;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
//   dataSource: ProductTableDataSource;

//   dat: ProductTableItem[]= [];
//   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
//   displayedColumns = ['id', 'name','price','quantity','icon'];

//   constructor(private employeeService: ProductTableService,private router: Router) {
//     this.dataSource = new ProductTableDataSource();
//   }

//   ngAfterViewInit(): void {
//     this.get();
//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;
//     // this.table.dataSource = this.dataSource;
//   }
//   private get(){
//     this.employeeService.getEmployeesList().subscribe(data => {
//       this.dat = data;
//       // console.log(this.dat);
//     });
//   }
//   deleteEmployee(id: any){
//     this.employeeService.deleteEmployee(id).subscribe( data => {
//       // console.log(data);
//       this.get();
//     })
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
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';

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

	public productList: any;
	ELEMENT_DATA: reports[] = [];
	displayedColumns: string[] = [
		'imageUrl',
		'productName',
		'price',
		'quantity',
		// 'Delete/Edit',
	];
	rColumns: string[] = ['', 'Product Name', 'Price', 'Quantity'];
	dataSource = new MatTableDataSource<reports>(this.ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true })
	paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true })
	sort: MatSort = new MatSort();

	constructor(
		private service: ProductTableService,
		private notificationService: NotificationService
	) {}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.getallp();
	}

	public getallp() {
		this.service.getEmployeesList().subscribe((data) => {
			this.dataSource.data = data as reports[];
			console.log(data);
		});
		//   let resp=this.service.getProduct();
		//   resp.subscribe(report=>this.dataSource.data=report as reports[])
	}
	deleteEmployee(id: any) {
		this.notificationService.notify(
			NotificationType.SUCCESS,
			'Item has been deleted'
		);
		this.service.deleteEmployee(id).subscribe((data) => {
			// console.log(data);
			this.getallp();
		});
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
