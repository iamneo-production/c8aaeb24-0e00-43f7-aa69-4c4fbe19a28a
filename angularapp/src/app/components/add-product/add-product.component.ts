import { Component, Input, OnInit } from '@angular/core';
import { AddProductService } from 'src/app/add-product.service';
import { addProduct } from 'src/app/addProduct';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  @Input() deviceXs: boolean = false;

  inst:addProduct = new addProduct();
  constructor(private loginservice: AddProductService, private router: Router) { }

  ngOnInit(): void {
  }
  go_login(){
    this.loginservice.addProd(this.inst).subscribe( data =>{
      console.log(data);
      this.goToProductList();
    },
    error => console.log(error));
  }
  goToProductList(){
    this.router.navigate(['/admin']);
  }
  onSubmit()
  {
    console.log(this.inst);
    this.go_login();
  }

}
