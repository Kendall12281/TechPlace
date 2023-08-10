import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from './material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';


import { LoginComponent } from './components/pages/authentication/login/login.component';
import { PrincipalComponent } from './components/pages/home/principal/principal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { InternalErrorComponent } from './components/shared/internal-error/internal-error.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { MainComponent as MainUserComponent } from './components/pages/maintenance/user/main/main.component';
import { BlankPageComponent } from './components/shared/blank-page/blank-page.component';
import { RegisterComponent } from './components/pages/authentication/register/register.component';
import { ListComponent as ProductList } from './components/pages/product/list/list.component';
import { DetailComponent as ProductDetail } from './components/pages/product/detail/detail.component';
import { ManagementComponent as ProductManagement} from './components/pages/product/management/management.component';
import { SaveComponent as ProductSave } from './components/pages/product/save/save.component';
import { ListComponent as OrderList} from './components/pages/order/list/list.component';
import { DetailComponent as OrderDetail } from './components/pages/order/detail/detail.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { Dashboard_adminComponent } from './components/pages/dashboard_admin/dashboard.component';
import { Dashboard_vendedorComponent } from './components/pages/dashboard_vendedor/dashboard.component';
import { SaveComponent } from './components/pages/maintenance/user/save/save.component';
import { CartComponent } from './components/pages/order/cart/cart.component';

//Modal component
import { modalComponent } from './components/shared/modal/modal.component';
import { ProfileComponent } from './components/pages/maintenance/user/profile/profile.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrincipalComponent,
    FooterComponent,
    HeaderComponent,
    InternalErrorComponent,
    NotFoundComponent,
    SidebarComponent,
    MainUserComponent,
    BlankPageComponent,
    RegisterComponent,
    ProductList,
    ProductDetail,
    OrderList,
    OrderDetail,
    ProductManagement,
    ProductSave,
    DashboardComponent,
    SaveComponent,
    CartComponent,
    Dashboard_adminComponent,
    Dashboard_vendedorComponent,
    modalComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgScrollbarModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    MaterialModule,
    CarouselModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
