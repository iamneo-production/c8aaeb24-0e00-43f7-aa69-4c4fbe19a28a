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
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'addProduct',component: AddProductComponent,canActivate:[AuthGuard,AdminGuard]},
  {path: 'editProduct/:id',component: EditProductComponent,canActivate:[AuthGuard,AdminGuard]},
  {path: 'admin',component: ProductTableComponent,canActivate:[AuthGuard,AdminGuard]},
  {path: 'admin/orders',component: OrderTableAdminComponent,canActivate:[AuthGuard,AdminGuard]},
  {path: 'home',component: HomePageComponent,canActivate:[AuthGuard,UserGuard]},
  {path: 'cart',component: CartComponent,canActivate:[AuthGuard,UserGuard]},
  {path: 'orders',component: MyOrderComponent,canActivate:[AuthGuard,UserGuard]},
  {path:'view/:id', component: ProductPageComponent,canActivate:[AuthGuard,UserGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
