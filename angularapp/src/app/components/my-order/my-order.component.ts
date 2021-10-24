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
@Component({
	selector: 'app-my-order',
	templateUrl: './my-order.component.html',
	styleUrls: ['./my-order.component.css'],
})
export class MyOrderComponent implements OnInit {
	@Input() deviceXs: boolean = false;

	public productList: any;
	ELEMENT_DATA: reports_order[] = [];
	displayedColumns: string[] = ['name', 'price', 'quantity', 'TotalPrice'];
	dataSource = new MatTableDataSource<reports_order>(this.ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true })
	paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true })
	sort: MatSort = new MatSort();
	var_del: AddCart = new AddCart();
	isempty: boolean = false;

	constructor(private service: HomeApiService, private router: Router) {}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.getall_order();
	}

	public getall_order() {
		this.service.getallorder().subscribe((data) => {
			this.dataSource.data = data as reports_order[];
		});
	}
}
export interface reports_order {
	orderId: string;
	userId: string;
	quantity: string;
	totalPrice: string;
	status: string;
	price: string;
	prodcutName: string;
}
