import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';
import { AddCart } from 'src/app/model/addcart';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserApiService } from '../../../apis/userApi.service';

@Component({
	selector: 'app-cartdialog',
	templateUrl: './cartdialog.component.html',
	styleUrls: ['./cartdialog.component.css'],
})
export class CartdialogComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<CartdialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private notificationService: NotificationService,
		protected ref: NbDialogRef<CartdialogComponent>,
		private userApi: UserApiService
	) {}

	cartItem!: AddCart;
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
			this.userApi.addItemToCart(this.cartItem).subscribe((data: any) => {
				if (data.result !== undefined) {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Item has been added to cart'
					);
				} else {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						data.message
					);
				}
			});
		} catch (err) {
			this.notificationService.notify(
				NotificationType.SUCCESS,
				'User request was not fulfilled'
			);
		}
		this.toggleLoadingAnimation();
	}
}
