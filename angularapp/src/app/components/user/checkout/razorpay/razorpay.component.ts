import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-razorpay',
	templateUrl: './razorpay.component.html',
	styleUrls: ['./razorpay.component.css'],
})
export class RazorpayComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
	options = {
		key: 'rzp_test_X2G3s0urP83jWN',
		amount: '',
		currency: 'INR',
		name: '',
		description: 'Test Transaction',
		image: '',
		order_id: '',
		callback_url: '',
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
}
