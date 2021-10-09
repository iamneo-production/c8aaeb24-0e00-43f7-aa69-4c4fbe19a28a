import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LogComponent } from './components/log/log.component';
import { OrderTableAdminComponent } from './components/order-table-admin/order-table-admin.component';
import { CartComponent } from './components/cart/cart.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { ProductPageComponent} from './components/product-page/product-page.component'
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'addProduct',component: AddProductComponent},
  {path: 'editProduct/:id',component: EditProductComponent},
  {path: 'admin',component: ProductTableComponent},
  {path: 'admin/orders',component: OrderTableAdminComponent},
  {path: 'home',component: HomePageComponent},
  {path: 'cart',component: CartComponent},
  {path: 'orders',component: MyOrderComponent},
  {path:'cart/1', component: ProductPageComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
