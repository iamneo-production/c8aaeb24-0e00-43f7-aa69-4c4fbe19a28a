import { AfterViewInit, Component, ViewChild,Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { OrderTableAdminDataSource, OrderTableAdminItem } from './order-table-admin-datasource';

@Component({
  selector: 'app-order-table-admin',
  templateUrl: './order-table-admin.component.html',
  styleUrls: ['./order-table-admin.component.css']
})
export class OrderTableAdminComponent implements AfterViewInit {
  @Input() deviceXs: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OrderTableAdminItem>;
  dataSource: OrderTableAdminDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'uid','bname','price','quant'];

  constructor() {
    this.dataSource = new OrderTableAdminDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
