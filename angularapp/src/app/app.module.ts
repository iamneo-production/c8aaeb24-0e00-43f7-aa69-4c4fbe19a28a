import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';
import { ProductTableComponent } from './components/admin/product-table/product-table.component';
import { HomePageComponent } from './components/user/home-page/home-page.component';
import { OrderTableAdminComponent } from './components/admin/order-table-admin/order-table-admin.component';
import { CartComponent } from './components/user/cart/cart.component';
import { MyOrderComponent } from './components/user/my-order/my-order.component';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './components/user/product-page/product-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NavbarAdminComponent } from './components/admin/navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from './components/user/navbar-user/navbar-user.component';

import { AuthGuard } from './guards/auth/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard';
import { UserGuard } from './guards/user/user.guard';
import { AuthQrComponent } from './components/public/auth-qr/auth-qr.component';
import { AuthOtpComponent } from './components/public/auth-otp/auth-otp.component';

import { ForgotPasswordComponent } from './components/public/forgot-password/forgot-password.component';

import {
	NbThemeModule,
	NbLayoutModule,
	NbButtonModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbCheckboxModule,
	NbCardModule,
	NbTabsetModule,
	NbListModule,
	NbToastrModule,
	NbStepperModule,
	NbSearchModule,
	NbSidebarModule,
	NbDialogModule,
	NbSpinnerModule,
	NbDialogService,
	NbAlertModule,
	NbUserModule,
	NbWindowModule,
	NbThemeService,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { GpayComponent } from './components/user/checkout/gpay/gpay.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { InterceptorService } from './services/interceptor/interceptor.service';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CartdialogComponent } from './components/user/cartdialog/cartdialog.component';
import {
	FullscreenOverlayContainer,
	OverlayContainer,
} from '@angular/cdk/overlay';
import { DashboardUserComponent } from './components/user/dashboard-user/dashboard-user.component';
import { FormValidatorsService } from './services/formvalidators/formvalidators.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { QuantityboxComponent } from './components/user/quantitybox/quantitybox.component';

@NgModule({
	declarations: [
		AppComponent,
		SignupComponent,
		AddProductComponent,
		EditProductComponent,
		ProductTableComponent,
		HomePageComponent,
		OrderTableAdminComponent,
		CartComponent,
		MyOrderComponent,
		ProductPageComponent,
		NavbarAdminComponent,
		NavbarUserComponent,
		AuthQrComponent,
		AuthOtpComponent,
		ForgotPasswordComponent,
		DashboardComponent,
		LoginComponent,
		CheckoutComponent,
		GpayComponent,
		CartdialogComponent,
		DashboardUserComponent,
		QuantityboxComponent,
	],
	imports: [
		NbSidebarModule,
		NbSearchModule,
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		CommonModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatMenuModule,
		MatSidenavModule,
		MatToolbarModule,
		MatCardModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatListModule,
		MatStepperModule,
		MatTabsModule,
		MatTreeModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatBadgeModule,
		MatChipsModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatRippleModule,
		MatBottomSheetModule,
		MatDialogModule,
		MatSnackBarModule,
		MatTooltipModule,
		MatPaginatorModule,
		MatSortModule,
		MatTableModule,
		ScrollingModule,
		HttpClientModule,
		NbThemeModule.forRoot({ name: 'dark' }),
		NbLayoutModule,
		NbEvaIconsModule,
		NbCardModule,
		NbListModule,
		NbIconModule,
		NbStepperModule,
		NbToastrModule.forRoot(),
		NbDialogModule.forRoot(),
		NbLayoutModule,
		NbEvaIconsModule,
		NbIconModule,
		NbCardModule,
		NbListModule,
		NbToastrModule.forRoot(),
		NbStepperModule,
		NbLayoutModule,
		NbEvaIconsModule,
		NbButtonModule,
		NbFormFieldModule,
		NbIconModule,
		FormsModule,
		NbInputModule,
		NbCheckboxModule,
		NbCardModule,
		NbTabsetModule,
		NbListModule,
		NbToastrModule.forRoot(),
		NbStepperModule,
		GooglePayButtonModule,
		NbSpinnerModule,
		NbSidebarModule.forRoot(),
		LoadingBarModule,
		LoadingBarRouterModule,
		LoadingBarHttpClientModule,
		MatDialogModule,
		NbDialogModule.forChild(),
		NbAlertModule,
		ReactiveFormsModule,
		NbUserModule,
		NbWindowModule.forRoot(),
		NbCardModule,
		GooglePayButtonModule,
		Ng2SearchPipeModule,
		BrowserAnimationsModule,
	],

	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
		AuthGuard,
		AdminGuard,
		UserGuard,
		MatDialogModule,
		NbToastrModule,
		NbDialogService,
		NbDialogModule,
		NbThemeService,
		FormValidatorsService,
		{
			provide: OverlayContainer,
			useClass: FullscreenOverlayContainer,
		},
	],
	bootstrap: [AppComponent],
	entryComponents: [AuthQrComponent, AuthOtpComponent, CartdialogComponent],
})
export class AppModule {}
