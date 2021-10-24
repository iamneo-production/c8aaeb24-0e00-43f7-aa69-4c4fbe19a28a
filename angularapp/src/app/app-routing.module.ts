import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import jwtDecode from 'jwt-decode';
import { RoleService } from './services/role.service';
import { DashboardUserComponent } from './components/dashboard-user/dashboard-user.component';

let routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'signup',
		component: SignupComponent,
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'addProduct',
		component: AddProductComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'editProduct/:id',
		component: EditProductComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'admin',
		component: ProductTableComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'admin/orders',
		component: OrderTableAdminComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'home',
		component: HomePageComponent,
		canActivate: [AuthGuard, UserGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'cart',
		component: CartComponent,
		canActivate: [AuthGuard, UserGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'orders',
		component: MyOrderComponent,
		canActivate: [AuthGuard, UserGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'view/:id',
		component: ProductPageComponent,
		canActivate: [AuthGuard, UserGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'checkout',
		component: CheckoutComponent,
		canActivate: [AuthGuard, UserGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'admin/dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { animation: 'routeAnimation' },
	},
	{
		path: 'dashboard',
		component: DashboardUserComponent,
		canActivate: [AuthGuard, UserGuard],
		data: { animation: 'routeAnimation' },
	},
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: false,
			anchorScrolling: 'enabled' || true,
			scrollPositionRestoration: 'enabled',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

export function configRoutes(roleService: RoleService) {}
