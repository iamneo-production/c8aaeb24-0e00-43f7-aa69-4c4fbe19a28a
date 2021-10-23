import { Component, OnInit } from '@angular/core';
import { AddCart } from 'src/app/model/addcart';
@Component({
	selector: 'app-addtocart',
	templateUrl: './addtocart.component.html',
	styleUrls: ['./addtocart.component.css'],
})
export class AddtocartComponent implements OnInit {
	constructor() {}
	var: AddCart = new AddCart();

	ngOnInit(): void {}

	public quant: any;

	onClick() {
		localStorage.setItem('quant', this.quant);
	}
}
