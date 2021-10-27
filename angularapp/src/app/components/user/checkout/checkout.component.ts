import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
	NbComponentStatus,
	NbDialogService,
	NbToastrService,
} from '@nebular/theme';
import jwtDecode from 'jwt-decode';
import { NotificationType } from 'src/app/services/notification/notification-type.enum';
import { FormValidatorsService } from '../../../services/formvalidators/formvalidators.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserApiService } from '../../../apis/userApi.service';

@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
	constructor(
		private toastrService: NbToastrService,
		private dialogService: NbDialogService,
		private notificationService: NotificationService,
		private router: Router,
		public formValidators: FormValidatorsService,
		private title: Title,
		private http: HttpClient,
		private userApi: UserApiService
	) {
		this.title.setTitle('EBook Store - Checkout');
	}

	cartItems =
		JSON.parse(
			localStorage.getItem('current_ordered_item') ||
				`[{"productId":"40285d257cc06fcc017cc06feacf0005","productName":"Sapiens","price":"319.0","quantity":"1"}]`
		) || [];

	strikeCheckout: any = null;
	paid: boolean = false;

	paymentDone: boolean = false;
	money: number = parseFloat(localStorage.getItem('price') || '5000');
	item: any = [];
	cart = JSON.parse(localStorage.getItem('cart') || '[]') || [];
	paymentRequest!: google.payments.api.PaymentDataRequest;
	buttonColor: any = 'black';
	buttonType: any = 'buy';
	isCustomSize = false;
	buttonWidth = 240;
	buttonHeight = 40;
	isTop = window === window.top;
	rzp1: any;
	jwt: any;

	checkOutForm = this.formValidators.checkOutForm;

	ngOnInit() {
		if (!!!localStorage.getItem('pay')) {
			this.router.navigate(['home']);
		}

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
			this.userApi.placeOrder(this.cartItems).subscribe((data: any) => {
				this.notificationService.notify(
					NotificationType.SUCCESS,
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
						alert('Payment done');
						this.notificationService.notify(
							'Success',
							NotificationType.SUCCESS,
							'bottom-right',
							'Payment Successful'
						);
						localStorage.removeItem('pay');
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

	store(res: any) {
		this.jwt = jwtDecode(localStorage.getItem('token') || '{}');
		this.http.post('http://localhost:8080/pay', {
			user_id: this.jwt.user_id,
			type: 'razorpay',
			amount: this.money,
		});
	}
	options = {
		key: 'rzp_test_X2G3s0urP83jWN',
		amount: parseFloat(localStorage.getItem('price') || '0') * 100,
		currency: 'INR',
		name: 'EBook Store - Team 2',
		description:
			JSON.parse(
				localStorage.getItem('current_ordered_item') ||
					`{productName: 'Payment for Book'}`
			).productName || 'Payment for book',
		image: '',
		callback_url: '',
		handler: async (res: any) => {
			const jwt: any = jwtDecode(localStorage.getItem('token') || '{}');
			const data = {
				paymentId: res.razorpay_payment_id,
				userId: jwt.user_id,
				amount: localStorage.getItem('price'),
				email: jwt.sub,
				provider: 'razorpay',
			};
			this.http
				.post(
					'http://localhost:8080/user/pay',
					{ data },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				)
				.subscribe(async (data: any) => {
					this.notificationService.notify(
						NotificationType.SUCCESS,
						'Payment Successful'
					);
					await localStorage.removeItem('pay');
					await this.router.navigate(['/home']);
				});
		},
		prefill: {
			name: 'EBook Store',
			email: 'team2.ebookstore@gmail.com',
			contact: '1234567890',
		},
		notes: {
			address: 'Razorpay Corporate Office',
		},
		theme: {
			color: '#7868e6',
		},
	};

	pay() {
		this.rzp1 = new this.userApi.nativeWindow.Razorpay(this.options);
		this.rzp1.open();
	}

	remove() {
		localStorage.removeItem('pay');
	}
}
