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
		key: 'rzp_test_7HdkaZ1xFGP0mB',
		amount: '50000',
		currency: 'INR',
		name: 'Acme Corp',
		description: 'Test Transaction',
		image: 'https://example.com/your_logo',
		order_id: 'order_9A33XWu170gUtm',
		callback_url: 'https://eneqd3r9zrjok.x.pipedream.net/',
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
