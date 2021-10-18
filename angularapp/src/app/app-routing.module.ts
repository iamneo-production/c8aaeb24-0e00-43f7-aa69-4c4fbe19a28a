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
import { AuthGuard } from './auth.guard';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'addProduct',component: AddProductComponent,canActivate:[AuthGuard]},
  {path: 'editProduct/:id',component: EditProductComponent,canActivate:[AuthGuard]},
  {path: 'admin',component: ProductTableComponent,canActivate:[AuthGuard]},
  {path: 'admin/orders',component: OrderTableAdminComponent,canActivate:[AuthGuard]},
  {path: 'home',component: HomePageComponent,canActivate:[AuthGuard]},
  {path: 'cart',component: CartComponent,canActivate:[AuthGuard]},
  {path: 'orders',component: MyOrderComponent,canActivate:[AuthGuard]},
  {path:'view/:id', component: ProductPageComponent,canActivate:[AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
