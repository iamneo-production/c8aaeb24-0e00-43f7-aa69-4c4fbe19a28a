// import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTable } from '@angular/material/table';
// import { MyOrderDataSource, MyOrderItem } from './my-order-datasource';

// @Component({
//   selector: 'app-my-order',
//   templateUrl: './my-order.component.html',
//   styleUrls: ['./my-order.component.css']
// })
// export class MyOrderComponent implements AfterViewInit {
//   @Input() deviceXs: boolean = false;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatTable) table!: MatTable<MyOrderItem>;
//   dataSource: MyOrderDataSource;

//   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
//   displayedColumns = ['name','price','quantity','TotalPrice'];

//   constructor() {
//     this.dataSource = new MyOrderDataSource();
//   }


//   ngAfterViewInit(): void {
//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;
//     this.table.dataSource = this.dataSource;
//   }
// }


import { AfterViewInit, Component, ViewChild,Input,OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { HomeApiService } from '../../home-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddCart } from '../../addcart'
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})



export class MyOrderComponent implements OnInit {
  @Input() deviceXs: boolean = false;

  public productList : any;
  ELEMENT_DATA: reports_order[] = [];
  displayedColumns:string[]=['name','price','quantity','TotalPrice'];
  dataSource = new MatTableDataSource<reports_order>(this.ELEMENT_DATA); 
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  var_del:AddCart= new AddCart();



  constructor(private service:HomeApiService, private router: Router){

  }

  ngOnInit(){
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort = this.sort;
    this.getall_order();

  }


  public getall_order(){
    this.service.getallorder().subscribe(data => {
      this.dataSource.data = data as reports_order[];
      console.log(data);
    })
  }


}
export interface reports_order{
    orderId: string;
    userId: string;
    quantity: string;
    totalPrice: string;
    status: string;
    price: string;
    prodcutName: string;
}