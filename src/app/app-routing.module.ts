import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent as ManageProductsComponent } from './manage/products/products.component';
import { ProductComponent as ManageProductComponent } from './manage/product/product.component';

const routes: Routes = [
	{ path: 'products', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'cart', component: CartComponent },
	{ path: 'manage/products', component: ManageProductsComponent },
	{ path: 'manage/product', component: ManageProductComponent },
	{ path: 'manage/product/:id', component: ManageProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
