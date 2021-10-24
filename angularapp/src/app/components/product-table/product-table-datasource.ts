import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface ProductTableItem {
	id: string;
	name: string;
	price: number;
	quant: number;
}

const EXAMPLE_DATA: ProductTableItem[] = [
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Hydrogen',
		price: 500,
		quant: 1,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Helium',
		price: 600,
		quant: 3,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Lithium',
		price: 799,
		quant: 4,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Beryllium',
		price: 899,
		quant: 9,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Hydrogen',
		price: 500,
		quant: 1,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Helium',
		price: 600,
		quant: 3,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Lithium',
		price: 799,
		quant: 4,
	},
	{
		id: 'https://image.freepik.com/free-psd/book-cover-mockup_125540-572.jpg',
		name: 'Beryllium',
		price: 899,
		quant: 9,
	},
];

export class ProductTableDataSource extends DataSource<ProductTableItem> {
	data: ProductTableItem[] = EXAMPLE_DATA;
	paginator: MatPaginator | undefined;
	sort: MatSort | undefined;

	constructor() {
		super();
	}

	connect(): Observable<ProductTableItem[]> {
		if (this.paginator && this.sort) {
			return merge(
				observableOf(this.data),
				this.paginator.page,
				this.sort.sortChange
			).pipe(
				map(() => {
					return this.getPagedData(this.getSortedData([...this.data]));
				})
			);
		} else {
			throw Error(
				'Please set the paginator and sort on the data source before connecting.'
			);
		}
	}
	disconnect(): void {}

	private getPagedData(data: ProductTableItem[]): ProductTableItem[] {
		if (this.paginator) {
			const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
			return data.splice(startIndex, this.paginator.pageSize);
		} else {
			return data;
		}
	}

	private getSortedData(data: ProductTableItem[]): ProductTableItem[] {
		if (!this.sort || !this.sort.active || this.sort.direction === '') {
			return data;
		}

		return data.sort((a, b) => {
			const isAsc = this.sort?.direction === 'asc';
			switch (this.sort?.active) {
				case 'name':
					return compare(a.name, b.name, isAsc);
				case 'id':
					return compare(+a.id, +b.id, isAsc);
				case 'price':
					return compare(+a.price, +b.price, isAsc);
				case 'quantity':
					return compare(+a.quant, +b.quant, isAsc);
				default:
					return 0;
			}
		});
	}
}

function compare(
	a: string | number,
	b: string | number,
	isAsc: boolean
): number {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
