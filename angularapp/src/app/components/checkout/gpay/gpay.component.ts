import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-gpay',
	templateUrl: './gpay.component.html',
	styleUrls: ['./gpay.component.css'],
})
export class GpayComponent implements OnInit {
	ngOnInit(): void {
		throw new Error('Method not implemented.');
	}
	buttonColor = 'black';
	buttonType = 'buy';
	isCustomSize = false;
	buttonWidth = 240;
	buttonHeight = 40;
	isTop = window === window.top;

	paymentRequest = {
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

	onLoadPaymentData(event: any) {
		console.log('load payment data', event.detail);
	}
}
