import { Component } from '@angular/core';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/productos.service';
import { take } from 'rxjs/operators';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/autenticacion.service';
import { GuardService } from 'src/app/services/guard.service';
import { ActivatedRoute } from '@angular/router';

// import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {
  productos: ProductoModel[];
  user: UsuarioModel;

  constructor(private productoService: ProductoService, 
    private authService: AuthService, private guardService: GuardService, private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    this.CargarProductos();
    this.LoadUserProfile();
  }
  
  CargarProductos() {
    this.productoService.getProductos().pipe(
      take(4)
    ).subscribe((productos) => {
      this.productos = productos;
    });
    
  }
  LoadUserProfile(){
    this.user=this.authService.userData();
  }
}
