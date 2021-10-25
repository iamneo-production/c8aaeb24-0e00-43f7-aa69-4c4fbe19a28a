import { Component, Input, OnInit } from '@angular/core';
import { addProduct } from '../../../model/addProduct';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from '../../../services/notification/notification.service';
import { Title } from '@angular/platform-browser';
import { AdminApiService } from '../../../apis/admin-api.service';
@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
	@Input() deviceXs: boolean = false;

	product!: addProduct;
	constructor(
		private adminApi: AdminApiService,
		private router: Router,
		private notificationService: NotificationService,
		private title: Title
	) {
		this.title.setTitle('EBook Store - Add Product');
		this.product = new addProduct();
	}

	ngOnInit(): void {}
	goToAddProduct() {
		this.adminApi.addProdcut(this.product).subscribe((data: any) => {
			if (data.result == true) {
				this.notificationService.notify(
					NotificationType.SUCCESS,
					'Item has been added'
				);
				this.router.navigate(['/admin']);
			} else {
				for (let t = 0; t < data.errors.length; ++t) {
					this.notificationService.notify(
						NotificationType.DANGER,
						data.errors[t]
					);
				}
			}
		});
	}
}
