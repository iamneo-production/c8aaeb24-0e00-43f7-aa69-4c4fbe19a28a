import { Component, Input, OnInit } from '@angular/core';
import { ProductTableItem } from '../../model/product_table';
import { ProductTableService } from '../../services/product-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
@Component({
	selector: 'app-edit-product',
	templateUrl: './edit-product.component.html',
	styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
	@Input() deviceXs: boolean = false;
	id: string = '';
	employee: ProductTableItem = new ProductTableItem();
	constructor(
		private employeeService: ProductTableService,
		private route: ActivatedRoute,
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.id = this.route.snapshot.params['id'];

		this.employeeService.getEmployeeById(this.id).subscribe(
			(data) => {
				this.employee = data;
			},
			(error) => console.log(error)
		);
	}

	onSubmit() {
		this.employeeService.updateEmployee(this.id, this.employee).subscribe(
			(data) => {
				this.notificationService.notify(
					NotificationType.SUCCESS,
					'Item has been edited'
				);
				console.log(data);
				this.goToEmployeeList();
			},
			(error) => console.log(error)
		);
	}

	goToEmployeeList() {
		this.router.navigate(['/admin']);
	}
}
