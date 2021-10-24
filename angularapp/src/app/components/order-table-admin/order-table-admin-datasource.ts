import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface OrderTableAdminItem {
	name: string;
	id: string;
	uid: string;
	price: number;
	quant: number;
}

const EXAMPLE_DATA: OrderTableAdminItem[] = [
	{ id: 'a223w-1323r', uid: 'user1', name: 'Gold', price: 600, quant: 1 },
	{ id: 'h223w-1323r', uid: 'user2', name: 'Hydrogen', price: 600, quant: 2 },
	{ id: 'f223w-1323r', uid: 'user3', name: 'Boron', price: 600, quant: 3 },
	{ id: 'e223w-1323r', uid: 'user1', name: 'Gold', price: 600, quant: 1 },
	{ id: 'a223w-1323r', uid: 'user2', name: 'Hydrogen', price: 600, quant: 2 },
	{ id: 'c223w-1323r', uid: 'user3', name: 'Boron', price: 600, quant: 3 },
	{ id: 'g223w-1323r', uid: 'user1', name: 'Gold', price: 600, quant: 1 },
	{ id: 'd223w-1323r', uid: 'user2', name: 'Hydrogen', price: 600, quant: 2 },
	{ id: 'a223w-1323r', uid: 'user3', name: 'Boron', price: 600, quant: 3 },
];

export class OrderTableAdminDataSource extends DataSource<OrderTableAdminItem> {
	data: OrderTableAdminItem[] = EXAMPLE_DATA;
	paginator: MatPaginator | undefined;
	sort: MatSort | undefined;

	constructor() {
		super();
	}

	connect(): Observable<OrderTableAdminItem[]> {
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
	private getPagedData(data: OrderTableAdminItem[]): OrderTableAdminItem[] {
		if (this.paginator) {
			const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
			return data.splice(startIndex, this.paginator.pageSize);
		} else {
			return data;
		}
	}

	private getSortedData(data: OrderTableAdminItem[]): OrderTableAdminItem[] {
		if (!this.sort || !this.sort.active || this.sort.direction === '') {
			return data;
		}

		return data.sort((a, b) => {
			const isAsc = this.sort?.direction === 'asc';
			switch (this.sort?.active) {
				case 'bname':
					return compare(a.name, b.name, isAsc);
				case 'id':
					return compare(+a.id, +b.id, isAsc);
				case 'uid':
					return compare(a.name, b.name, isAsc);
				case 'price':
					return compare(+a.id, +b.id, isAsc);
				case 'quant':
					return compare(+a.id, +b.id, isAsc);

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
