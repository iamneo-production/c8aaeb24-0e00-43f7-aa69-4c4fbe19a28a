import { ProductTableService } from '../../services/product-table.service';
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
		});
	}
	deleteEmployee(id: any) {
		this.notificationService.notify(
			'Success',
			NotificationType.SUCCESS,
			'bottom-right',
			'Item has been deleted'
		);
		this.service.deleteEmployee(id).subscribe((data) => {
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
