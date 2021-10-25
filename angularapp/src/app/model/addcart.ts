export class AddCart {
	constructor(productId: string, quantity: string) {
		this.productId = productId;
		this.quantity = quantity;
	}

	productId?: string;
	quantity?: string;
}
