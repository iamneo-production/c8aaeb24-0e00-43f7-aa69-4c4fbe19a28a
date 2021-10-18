import { Component, OnInit ,Input} from '@angular/core';
import { HomeApiService } from '../../home-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit{

  public productList : any;
  @Input() deviceXs: boolean = false;
  constructor(private api:HomeApiService){}

    ngOnInit():void{
      this.api.getProduct()
      .subscribe((res: any)=>{
        this.productList=res;
        console.log(res);
      })

    
  }

}


