import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
	NbComponentStatus,
	NbDialogService,
	NbToastrService,
} from '@nebular/theme';
import { NotificationType } from 'src/app/notification-type.enum';
import { HomeApiService } from 'src/app/services/home-api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
	constructor(
		private toastrService: NbToastrService,
		private dialogService: NbDialogService,
		private api: HomeApiService,
		private notificationService: NotificationService,
		private router: Router
	) {}

	cartItems = JSON.parse(localStorage.getItem('current_ordered_item') || '{}');

	strikeCheckout: any = null;
	paid: boolean = false;

	paymentDone: boolean = false;
	money: number = 10;
	item: any = [];

	ngOnInit() {
		console.log(this.cartItems);
		this.stripePaymentGateway();
	}

	togglePaid(status: boolean) {
		this.paid = status;
	}

	finalizeOrder() {
		if (this.paid && this.cartItems.length != 0) {
			this.api.placeitem(this.cartItems).subscribe((data: any) => {
				this.notificationService.notify(
					'Success',
					NotificationType.SUCCESS,
					'bottom-right',
					'Order for this item has been placed'
				);
				console.log(data);
				this.router.navigate(['/home']);
			});
		}
	}

	checkout(amount: number) {
		const strikeCheckout = (<any>window).StripeCheckout.configure({
			key: 'pk_test_51JmDVESFjEN8qpCc2PeNlV8XE1IojisE9Zc0G4N71kmzNWpfDCR3GjZhuvMHM1tDWE9pUCQMlnKI4qkmMSUIGize00AVNkUozF',
			locale: 'auto',
			token: function (stripeToken: any) {
				this.paid = true;
			},
		});

		strikeCheckout.open({
			name: 'EBook Store',
			description: 'Virtusa NeuralHack 5',
			amount: amount * 100,
		});
	}

	stripePaymentGateway() {
		if (!window.document.getElementById('stripe-script')) {
			const scr = window.document.createElement('script');
			scr.id = 'stripe-script';
			scr.type = 'text/javascript';
			scr.src = 'https://checkout.stripe.com/checkout.js';

			scr.onload = () => {
				this.strikeCheckout = (<any>window).StripeCheckout.configure({
					key: 'pk_test_51JmDVESFjEN8qpCc2PeNlV8XE1IojisE9Zc0G4N71kmzNWpfDCR3GjZhuvMHM1tDWE9pUCQMlnKI4qkmMSUIGize00AVNkUozF',
					locale: 'auto',
					token: function (token: any) {
						console.log(token);
						alert('Payment Successful');
						this.paymentDone = !this.paymentDone;
					},
				});
			};

			window.document.body.appendChild(scr);
		}
	}

	showToast(msg: string, status: NbComponentStatus) {
		this.toastrService.show(msg, { status });
	}

	open(dialog: TemplateRef<any>) {
		this.dialogService.open(dialog, {
			context: 'this is some additional data passed to dialog',
		});
	}
}
