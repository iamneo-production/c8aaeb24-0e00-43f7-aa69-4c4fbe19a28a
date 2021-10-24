import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface MyOrderItem {
	name: string;
	price: number;
	quantity: number;
	TotalPrice: number;
}

const EXAMPLE_DATA: MyOrderItem[] = [
	{ price: 1, name: 'Hydrogen', quantity: 2, TotalPrice: 292 },
	{ price: 2, name: 'Helium', quantity: 1, TotalPrice: 322 },
	{ price: 3, name: 'Lithium', quantity: 3, TotalPrice: 200 },
	{ price: 4, name: 'Beryllium', quantity: 2, TotalPrice: 393 },
];

export class MyOrderDataSource extends DataSource<MyOrderItem> {
	data: MyOrderItem[] = EXAMPLE_DATA;
	paginator: MatPaginator | undefined;
	sort: MatSort | undefined;

	constructor() {
		super();
	}

	connect(): Observable<MyOrderItem[]> {
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

	private getPagedData(data: MyOrderItem[]): MyOrderItem[] {
		if (this.paginator) {
			const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
			return data.splice(startIndex, this.paginator.pageSize);
		} else {
			return data;
		}
	}

	private getSortedData(data: MyOrderItem[]): MyOrderItem[] {
		if (!this.sort || !this.sort.active || this.sort.direction === '') {
			return data;
		}

		return data.sort((a, b) => {
			const isAsc = this.sort?.direction === 'asc';
			switch (this.sort?.active) {
				case 'name':
					return compare(a.name, b.name, isAsc);
				case 'price':
					return compare(+a.price, +b.price, isAsc);
				case 'quantity':
					return compare(+a.quantity, +b.quantity, isAsc);
				case 'TotalPrice':
					return compare(+a.TotalPrice, +b.TotalPrice, isAsc);
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
