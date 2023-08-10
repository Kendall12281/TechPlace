import { Component } from "@angular/core";
import { DashboardService } from "src/app/services/dashboard.service";

@Component({
  selector: "app-dashboard_vendedor",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class Dashboard_vendedorComponent {
  producto_mas_vendido = {
    producto_id: 0,
    nombre: "",
    descripcion: "",
    precio: "",
    total_vendido: "",
  };

  cliente_mas_compras = {
    usuario_id: 0,
    nombre_completo: "",
    total_cantidad: "",
  };

  calificaciones = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.ProductoMasVendido();
    this.ClienteMasCompras();
    this.CalificacionVendedor();
    console.log(this.calificaciones)
  }

  ProductoMasVendido() {
    this.dashboardService.ProductoMasVendido().subscribe((producto) => {
      this.producto_mas_vendido.nombre =
        producto.producto_mas_vendido[0].nombre;
      this.producto_mas_vendido.producto_id =
        producto.producto_mas_vendido[0].producto_id;
      this.producto_mas_vendido.descripcion =
        producto.producto_mas_vendido[0].descripcion;
      this.producto_mas_vendido.precio =
        producto.producto_mas_vendido[0].precio;
      this.producto_mas_vendido.total_vendido =
        producto.producto_mas_vendido[0].total_vendido;
    });
  }
  ClienteMasCompras() {
    this.dashboardService.ClienteMasCompras().subscribe((cliente) => {
      this.cliente_mas_compras.usuario_id =
        cliente.cliente_mas_compras[0].usuario_id;
      this.cliente_mas_compras.nombre_completo =
        cliente.cliente_mas_compras[0].nombre_completo;
      this.cliente_mas_compras.total_cantidad =
        cliente.cliente_mas_compras[0].total_cantidad;
    });
  }
  CalificacionVendedor() {
    this.dashboardService.CalificacionVendedor().subscribe((calificacion) => {
      this.calificaciones[1] = calificacion.calificaciones[0].count;
      this.calificaciones[2] = calificacion.calificaciones[1].count;
      this.calificaciones[3] = calificacion.calificaciones[2].count;
      this.calificaciones[4] = calificacion.calificaciones[3].count;
      this.calificaciones[5] = calificacion.calificaciones[4].count;
    });
  }
}