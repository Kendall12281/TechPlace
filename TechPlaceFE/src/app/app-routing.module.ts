import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { InternalErrorComponent } from './components/shared/internal-error/internal-error.component';
import { BlankPageComponent } from './components/shared/blank-page/blank-page.component';

import { PrincipalComponent } from './components/pages/home/principal/principal.component';
import { LoginComponent } from './components/pages/authentication/login/login.component';
import { RegisterComponent } from './components/pages/authentication/register/register.component';
import { MainComponent as MainUserComponent } from './components/pages/maintenance/user/main/main.component';

import { ListComponent as ProductListComponent } from './components/pages/product/list/list.component';
import { DetailComponent as ProductDetailComponent } from './components/pages/product/detail/detail.component';
import { ManagementComponent as ProductManagementComponent } from './components/pages/product/management/management.component';
import { SaveComponent as ProductSaveComponent } from './components/pages/product/save/save.component';

import { ListComponent as OrderListComponent } from './components/pages/order/list/list.component';
import { DetailComponent as OrderDetailComponent } from './components/pages/order/detail/detail.component';
import { CartComponent } from './components/pages/order/cart/cart.component';

import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { SaveComponent as UserSaveComponent } from './components/pages/maintenance/user/save/save.component';
import { ProfileComponent } from './components/pages/maintenance/user/profile/profile.component';

import { Dashboard_adminComponent } from './components/pages/dashboard_admin/dashboard.component';
import { Dashboard_vendedorComponent } from './components/pages/dashboard_vendedor/dashboard.component';

const routes: Routes = [
  {path: 'error-500', component: InternalErrorComponent},
  {path: 'blank-page', component: BlankPageComponent},
  {path: '', component: PrincipalComponent},
  {path: 'authentication/login', component: LoginComponent},
  {path: 'authentication/register', component: RegisterComponent},
  {path: 'maintenance/user', component: MainUserComponent},
  {path: 'maintenance/user/create', component: UserSaveComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'maintenance/user/edit', component: UserSaveComponent},
  {path: 'product/list', component: ProductListComponent},
  {path: 'product/detail', component: ProductDetailComponent},
  {path: 'product/management', component: ProductManagementComponent},
  {path: 'product/create', component: ProductSaveComponent},
  {path: 'product/edit', component: ProductSaveComponent},
  {path: 'order/list', component: OrderListComponent},
  {path: 'order/detail', component: OrderDetailComponent},
  {path: 'order/detailseller', component: OrderDetailComponent},
  {path: 'order/cart', component: CartComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'dashboard/admin', component: Dashboard_adminComponent},
  {path: 'dashboard/vendedor', component: Dashboard_vendedorComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
