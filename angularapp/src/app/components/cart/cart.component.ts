// import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTable } from '@angular/material/table';
// import { CartDataSource, CartItem } from './cart-datasource';
// import { HomeApiService } from '../../home-api.service';

// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.css']
// })
// export class CartComponent implements AfterViewInit {
//   @Input() deviceXs: boolean = false;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatTable) table!: MatTable<CartItem>;
//   dataSource: CartDataSource;

//   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
//   displayedColumns = ['name','price','quantity','actions'];

//   constructor(private api:HomeApiService) {
//     this.dataSource = new CartDataSource();
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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})



export class CartComponent implements OnInit {
  @Input() deviceXs: boolean = false;

  public productList : any;
  ELEMENT_DATA: reports[] = [];
  displayedColumns:string[]=['name','price','quantity','actions'];
  dataSource = new MatTableDataSource<reports>(this.ELEMENT_DATA); 
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
    this.getallp_cart();

  }


  public getallp_cart(){
    this.service.getcartProduct().subscribe(data => {
      this.dataSource.data = data as reports[];
      console.log(data);
    })
  }

    deleteEmployee(id: any){
        this.var_del.productId=id;
        this.var_del.quantity="40";
    this.service.deleteitem(this.var_del).subscribe( (data:any) => {
      console.log(data);
      this.getallp_cart();
    })
  }

  saveorder()
  {
        this.service.dosaveorder().subscribe(data => {
           console.log(data);
            this.router.navigate(['/home']);
    })
  }

}
export interface reports{
  productId:string;
  productName: string;
  price: string;
  quantity:string;
}
/*export class ProductTableComponent implements AfterViewInit {
  @Input() deviceXs: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
  dataSource: ProductTableDataSource;

  displayedColumns = ['id', 'name','price','quantity','icon'];

  constructor() {
    this.dataSource = new ProductTableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}*/
