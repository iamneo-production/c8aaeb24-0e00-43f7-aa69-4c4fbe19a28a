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
		private service: ProductTableService,
		private route: ActivatedRoute,
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		// take the product id from route
		this.id = this.route.snapshot.params['id'];

		this.service.GetItemById(this.id).subscribe((data) => {
			this.employee = data;
		});
	}
	OnSubmit() {
		this.service
			.UpdateProductDetail(this.id, this.employee)
			.subscribe((data) => {
				this.notificationService.notify(
					'Success',
					NotificationType.SUCCESS,
					'bottom-right',
					'Item has been edited'
				);
				this.GoToAdminHome();
			});
	}

	GoToAdminHome() {
		this.router.navigate(['/admin']);
	}
}
