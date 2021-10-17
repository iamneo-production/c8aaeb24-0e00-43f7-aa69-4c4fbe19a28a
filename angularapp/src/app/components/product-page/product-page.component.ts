import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../home-api.service';
import { ProductTableItem } from'../../product_table';
import { AddCart } from '../../addcart'
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  id: string='';
  productList : ProductTableItem= new ProductTableItem();
  addcart: AddCart = new AddCart();
  @Input() deviceXs: boolean = false;
  
  constructor(private api:HomeApiService,private route: ActivatedRoute,private router: Router){}

    ngOnInit():void{
      this.id = this.route.snapshot.params['id'];
      this.api.getProduct()
      .subscribe((res: any)=>{
        for (let i = 0; i < res.length; i++)
        {
          if(res[i].productId==this.id)
          {
            this.productList=res[i];
          }
        }
      })
  }

  onaddcart()
  {
    this.addcart.quantity=this.productList.quantity;
    this.addcart.productId=this.productList.productId;

    this.api.addcart(this.addcart).subscribe((data:any)=>{
      console.log(data);
      this.router.navigate(['/home']);
    })
  }

}
