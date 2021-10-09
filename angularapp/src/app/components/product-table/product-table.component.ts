import { AfterViewInit, Component, ViewChild,Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ProductTableDataSource } from './product-table-datasource';
import { ProductTableItem } from '../../product_table';
import { ProductTableService } from 'src/app/product-table.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements AfterViewInit {

  @Input() deviceXs: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
  dataSource: ProductTableDataSource;
  
  dat: ProductTableItem[]= [];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name','price','quantity','icon'];

  constructor(private employeeService: ProductTableService,private router: Router) {
    this.dataSource = new ProductTableDataSource();
  }

  ngAfterViewInit(): void {
    this.get();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.table.dataSource = this.dataSource;
  }
  private get(){
    this.employeeService.getEmployeesList().subscribe(data => {
      this.dat = data;
      console.log(this.dat);
    });
  }
  deleteEmployee(id: any){
    this.employeeService.deleteEmployee(id).subscribe( data => {
      console.log(data);
      this.get();
    })
  }

  editEmployee(id:any)
  {
    this.router.navigate(['/editProduct]']);
  }

}
