import { Component, Input, OnInit } from '@angular/core';
import { AddProductService } from '../../services/add-product.service';
import { addProduct } from '../../model/addProduct';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
	@Input() deviceXs: boolean = false;

	inst: addProduct = new addProduct();
	constructor(
		// injecting all required services
		private addproduct: AddProductService,
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {}
	// subscribing the data from the addProduct service
	GoAddProduct() {
		this.addproduct.AddProduct(this.inst).subscribe(
			(data) => {
				// console.log(data);
				this.notificationService.notify(
					'Success',
					NotificationType.SUCCESS,
					'bottom-right',
					'Item has been added'
				);
				this.GoToProductList();
			},
			(error) => console.log(error)
		);
	}
	// redirection for admin-home-page after adding products
	GoToProductList() {
		this.router.navigate(['/admin']);
	}
	// after clicking on AddProduct
	OnSubmit() {
		// console.log(this.inst);
		this.GoAddProduct();
	}
}
