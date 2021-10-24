import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
	NbComponentStatus,
	NbDialogService,
	NbToastrService,
} from '@nebular/theme';
import { NotificationType } from 'src/app/notification-type.enum';
import { FormValidatorsService } from 'src/app/services/formvalidators.service';
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
		private router: Router,
		public formValidators: FormValidatorsService
	) {}

	cartItems = JSON.parse(localStorage.getItem('current_ordered_item') || '{}');

	strikeCheckout: any = null;
	paid: boolean = false;

	paymentDone: boolean = false;
	money: number = 10;
	item: any = [];
	cart = JSON.parse(localStorage.getItem('cart') || '[]');
	paymentRequest!: google.payments.api.PaymentDataRequest;
	buttonColor: any = 'black';
	buttonType: any = 'buy';
	isCustomSize = false;
	buttonWidth = 240;
	buttonHeight = 40;
	isTop = window === window.top;

	checkOutForm = this.formValidators.checkOutForm;

	ngOnInit() {
		this.stripePaymentGateway();
		this.paymentRequest = {
			apiVersion: 2,
			apiVersionMinor: 0,
			allowedPaymentMethods: [
				{
					type: 'CARD',
					parameters: {
						allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
						allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD'],
					},
					tokenizationSpecification: {
						type: 'PAYMENT_GATEWAY',
						parameters: {
							gateway: 'example',
							gatewayMerchantId: 'exampleGatewayMerchantId',
						},
					},
				},
			],
			merchantInfo: {
				merchantId: '12345678901234567890',
				merchantName: 'Demo Merchant',
			},
			transactionInfo: {
				totalPriceStatus: 'FINAL',
				totalPriceLabel: 'Total',
				totalPrice: '100.00',
				currencyCode: 'USD',
				countryCode: 'US',
			},
		};
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

	onLoadPaymentData(event: any) {}
}
