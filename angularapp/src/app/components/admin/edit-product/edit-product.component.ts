import { Component, Input, OnInit } from '@angular/core';
import { ProductTableItem } from '../../../model/product_table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from '../../../services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { Title } from '@angular/platform-browser';
import { AdminApiService } from '../../../apis/admin-api.service';
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
		private route: ActivatedRoute,
		private router: Router,
		private notificationService: NotificationService,
		private title: Title,
		private adminApi: AdminApiService
	) {
		this.title.setTitle('EBook Store - Edit Product');
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.params['id'];

		this.adminApi.getProductById(this.id).subscribe((data: any) => {
			this.employee = data;
		});
	}
	OnSubmit() {
		this.adminApi
			.editProductDetails(this.id, this.employee)
			.subscribe((data: any) => {
				if (data.result == true) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Item has been edited'
					);
					this.GoToAdminHome();
				} else {
					this.notificationService.notify(
						NotificationType.DANGER,
						data.message
					);
				}
			});
	}

	GoToAdminHome() {
		this.router.navigate(['/admin']);
	}
}
