import { Component, Input, OnInit} from '@angular/core';
import { ProductTableItem } from 'src/app/product_table';
import {EditProductTableItem} from 'src/app/edit_item';
import { ProductTableService } from 'src/app/product-table.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{
  @Input() deviceXs: boolean = false;
  id: string='';
  employee: ProductTableItem = new ProductTableItem();
  editemployee: EditProductTableItem = new EditProductTableItem();
  constructor(private employeeService: ProductTableService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.employeeService.getEmployeeById(this.id).subscribe(data => {
      this.employee = data;
    }, error => console.log(error));
  }

  onSubmit(){
    this.employeeService.updateEmployee(this.id, this.editemployee).subscribe( data =>{
      console.log(data);
      this.goToEmployeeList();
    }
    , error => console.log(error));
  }

  goToEmployeeList(){
    this.router.navigate(['/admin']);
  }
}

