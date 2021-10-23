import { NgModule } from '@angular/core';
import { RouterModule, ROUTES, Routes } from '@angular/router';
// import { LoginComponent } from './components/login1/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { OrderTableAdminComponent } from './components/order-table-admin/order-table-admin.component';
import { CartComponent } from './components/cart/cart.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';
import { MatDialog } from '@angular/material/dialog';
import { AuthQrComponent } from './components/auth-qr/auth-qr.component';
import { AuthOtpComponent } from './components/auth-otp/auth-otp.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import jwtDecode from 'jwt-decode';
import { RoleService } from './services/role.service';
import { DashboardUserComponent } from './components/dashboard-user/dashboard-user.component';

let routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{
		path: 'addProduct',
		component: AddProductComponent,
		canActivate: [AuthGuard, AdminGuard],
	},
	{
		path: 'editProduct/:id',
		component: EditProductComponent,
		canActivate: [AuthGuard, AdminGuard],
	},
	{
		path: 'admin',
		component: ProductTableComponent,
		canActivate: [AuthGuard, AdminGuard],
	},
	{
		path: 'admin/orders',
		component: OrderTableAdminComponent,
		canActivate: [AuthGuard, AdminGuard],
	},
	{
		path: 'home',
		component: HomePageComponent,
		canActivate: [AuthGuard, UserGuard],
	},
	{
		path: 'cart',
		component: CartComponent,
		canActivate: [AuthGuard, UserGuard],
	},
	{
		path: 'orders',
		component: MyOrderComponent,
		canActivate: [AuthGuard, UserGuard],
	},
	{
		path: 'view/:id',
		component: ProductPageComponent,
		canActivate: [AuthGuard, UserGuard],
	},
	{
		path: 'checkout',
		component: CheckoutComponent,
		canActivate: [AuthGuard, UserGuard],
	},
	{
		path: 'admin/dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard, AdminGuard],
	},
	{
		path: 'dashboard',
		component: DashboardUserComponent,
		canActivate: [AuthGuard, UserGuard],
	},
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: '**', redirectTo: 'login', pathMatch: 'full' },
	// {path: '', component: HomePageComponent, children: [{ path: 'home', component: AuthQrComponent }]},
	// {path: '', component: HomePageComponent, children: [{ path: 'home', component: AuthOtpComponent }]},
	// {path: '', component: LoginComponent, children: [{ path: 'login', component: ForgotPasswordComponent }]},
];

@NgModule({
	imports: [
		// RouterModule.forRoot( {
		// 	useHash: false,
		// 	anchorScrolling: 'enabled',
		// }),
		RouterModule.forRoot(routes, {
			useHash: false,
			anchorScrolling: 'enabled' || true,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

export function configRoutes(roleService: RoleService) {}
