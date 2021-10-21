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
		private loginservice: AddProductService,
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {}
	go_login() {
		this.loginservice.addProd(this.inst).subscribe(
			(data) => {
				console.log(data);
				this.notificationService.notify(
					NotificationType.SUCCESS,
					'Item has been added'
				);
				this.goToProductList();
			},
			(error) => console.log(error)
		);
	}
	goToProductList() {
		this.router.navigate(['/admin']);
	}
	onSubmit() {
		console.log(this.inst);
		this.go_login();
	}
}
