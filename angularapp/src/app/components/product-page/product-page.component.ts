import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../home-api.service';
import { ProductTableItem } from'../../product_table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  emp:ProductTableItem= new ProductTableItem();
  id: string='';
  public productList : any;
  @Input() deviceXs: boolean = false;
  constructor(private api:HomeApiService,private route: ActivatedRoute,private router: Router){}

    ngOnInit():void{
      this.id = this.route.snapshot.params['id'];
      this.api.getProductDetail(this.id).subscribe(data=>{
        this.productList=data;
        console.log(this.productList);
      })

    
  }

}
