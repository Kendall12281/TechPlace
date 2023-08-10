import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ToggleService } from './toggle.service';
import { DatePipe } from '@angular/common';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/autenticacion.service';
import { Location } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { CarritoModel } from 'src/app/models/carrito.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: UsuarioModel | null;
  isSticky: boolean = false;
  carrito: CarritoModel[] = [];
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPosition >= 50) {
          this.isSticky = true;
      } else {
          this.isSticky = false;
      }
  }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  searchText: string = "";

  isToggled = false;
  
  constructor(
      private router: Router,
      private toggleService: ToggleService,
      private datePipe: DatePipe,
      private authService : AuthService,
      private location: Location,
      private carritoService: CarritoService
  ) {
      this.toggleService.isToggled$.subscribe(isToggled => {
          this.isToggled = isToggled;
      });
  }

  toggle() {
      this.toggleService.toggle();
  }

  currentDate: Date = new Date();
  formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

  async logout(){
      await this.authService.logout();
      this.router.navigateByUrl('/');
      window.location.reload();
  }

  search(){
    const navigationExtras: NavigationExtras = {
        queryParams: { search: this.searchText }
      };
    this.router.navigate([`product/list`],navigationExtras);
  }
  updateSearchText(event: any){
    this.searchText = event.target.value;
  }
}
