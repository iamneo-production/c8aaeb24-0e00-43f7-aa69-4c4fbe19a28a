import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';
import { AddCart } from 'src/app/model/addcart';
import { NotificationType } from 'src/app/notification-type.enum';
import { HomeApiService } from 'src/app/services/home-api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-cartdialog',
	templateUrl: './cartdialog.component.html',
	styleUrls: ['./cartdialog.component.css'],
})
export class CartdialogComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<CartdialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private api: HomeApiService,
		private notificationService: NotificationService,
		protected ref: NbDialogRef<CartdialogComponent>
	) {}

	cartItem: AddCart = new AddCart();
	loading: boolean = false;

	item: any = JSON.parse(
		this.data.item || localStorage.getItem('current_ordered_item') || '{}'
	);
	quantity: number = 0;
	ngOnInit(): void {}

	toggleLoadingAnimation() {
		this.loading = !this.loading;
	}
	addToCart() {
		this.toggleLoadingAnimation();
		try {
			this.cartItem.quantity = this.quantity.toString();
			this.cartItem.productId = this.item.productId;
			this.api.addcart(this.cartItem).subscribe((data: any) => {
				if (data.result !== undefined) {
					this.notificationService.notify(
						'Success',
						NotificationType.SUCCESS,
						'bottom-right',
						'Item has been added to cart'
					);
				} else {
					this.notificationService.notify(
						'Error',
						NotificationType.SUCCESS,
						'bottom-right',
						data.message
					);
				}
			});
		} catch (err) {
			this.notificationService.notify(
				'Error',
				NotificationType.SUCCESS,
				'bottom-right',
				'User request was not fulfilled'
			);
		}
		this.toggleLoadingAnimation();
	}
}
