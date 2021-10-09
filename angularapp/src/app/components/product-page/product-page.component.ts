import { Component, OnInit, Input } from '@angular/core';
import { HomeApiService } from '../../home-api.service';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {


  public productList : any;
  @Input() deviceXs: boolean = false;
  constructor(private api:HomeApiService){}

    ngOnInit():void{
      this.api.getProduct()
      .subscribe((res: any)=>{
        this.productList=res;

      })

    
  }

}
