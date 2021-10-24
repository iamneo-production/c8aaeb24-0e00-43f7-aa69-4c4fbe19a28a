import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../services/home-api.service';
import { ProductTableItem } from '../../model/product_table';
import { AddCart } from '../../model/addcart';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/notification-type.enum';
import { NotificationService } from '../../services/notification.service';
import { CartdialogComponent } from '../cartdialog/cartdialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
	selector: 'app-product-page',
	templateUrl: './product-page.component.html',
	styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
	id: string = '';
	productList: ProductTableItem = new ProductTableItem();
	productList1: ProductTableItem = new ProductTableItem();
	addcart: AddCart = new AddCart();
	additem: AddCart = new AddCart();
	description: string = `James Allen|Can you think of a single moment in the whole day when your mind is blank and thoughtless?Do you know how powerful every thought is?“Cherish your visions; cherish your ideals; cherish the music that stirs in your heart, the beauty that forms in your mind, the loveliness that drapes your purest thoughts, for out of them will grow all delightful conditions, all heavenly environment; of these, if you but remain true to them, your world will at last be built.”Giving an insight into the power of thoughts; the effect they have on our health, body and circumstances; and how we become what we think; this compelling literary essay by James Allen contains practical wisdom which will inspire, enlighten and help us discover our hidden powers.Written in a spiritual tone, As a Man Thinketh has been a valuable source of inspiration ever since its first publication in 1903. It continues to remain a classic bestseller.|26 November 2017|9386538172|James Allen was born on 28 November 1864 in Leicester, England. In 1989, he began working as a writer for the magazine The Herald of the Golden Age. His first book, From Poverty to Power, was written and published in 1901. The following year, Allen started a spiritual magazine titled The Light of Reason. It was later renamed The Epoch. All These Things Added (1903) was his second book.As a Man Thinketh, his third book, was published in 1903. A literary essay, it describes the way our thoughts impact our lives. We tend to become what we think. Serving as a source of inspiration, this book is one of his most famous and bestselling works. He published numerous works among which are: Out from the Heart (1904), Morning and Evening Thoughts (1909), From Passion to Peace (1910), Light on Life’s Difficulties (1912), The Shining Gateway (1915) and The Divine Companion (1919). Allen died on 24 January 1912, aged forty-seven. He is considered as one of the founding fathers of modern inspirational thought.|96|English|Fingerprint! Publishing|4.4`;
	desList: any;
	public cartItem: any;
	@Input() deviceXs: boolean = false;

	isReadMore = true;
	hash: string = '';
	url: string = '';
	loc: string = '';
	port: string = '';
	item: any;

	constructor(
		private api: HomeApiService,
		private route: ActivatedRoute,
		private router: Router,
		private notificationService: NotificationService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.port = new URL(window.location.href).port;
		this.hash = new URL(window.location.href).hash;
		this.url = this.hash.slice(this.hash.lastIndexOf('/') + 1);
		this.id = this.route.snapshot.params['id'];
		this.item = JSON.parse(
			localStorage.getItem('current_ordered_item') || '{}'
		);
		this.productList = this.item;
	}

	showText() {
		this.isReadMore = !this.isReadMore;
	}

	onaddcart(item: any) {
		this.cartItem = new AddCart();
		this.cartItem.productId = item.productId;
		this.cartItem.quantity = '1';
		this.api.addcart(this.cartItem).subscribe((data: any) => {
			this.notificationService.notify(
				'Success',
				NotificationType.SUCCESS,
				'bottom-right',
				'Item added to the cart'
			);
		});
	}

	placeitem(productList: any) {
		console.log(productList);
		localStorage.setItem('current_ordered_item', JSON.stringify(this.item));
		this.additem.quantity = this.productList.quantity;
		this.additem.productId = this.productList.productId;
		this.router.navigate(['/checkout']);
	}

	see(data: any) {
		this.loc = 'http://localhost:' + this.port + '/view/' + data.productId;
		window.location.href = this.loc;
		window.location.reload();
	}
}
