import { Component } from '@angular/core';
import {DashboardService} from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard_admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class Dashboard_adminComponent {
  cantidad_compras = 0;
  productos_mas_comprados_mes : any[] = [];
  top_5_vendedores : any[] = [];
  top_5_peores_vendedores : any[] = [];

  constructor(private dashboardService : DashboardService){}

  ngOnInit(){
    this.ObtenerCantidadComprasDia();
    this.Top5ProductosMes();
    this.Top5Vendedores();
    this.Top5PeoresVendedores();
  }

  ObtenerCantidadComprasDia(){
    this.dashboardService.ObtenerCantidadComprasDia().subscribe((cantidad)=>{
      this.cantidad_compras = cantidad.cantidad_compras;
    });
  }

  Top5ProductosMes(){
    this.dashboardService.Top5ProductosMes().subscribe((producto)=>{
      for(var item  in producto.top_5_productos_Mes){
        this.productos_mas_comprados_mes.push(producto.top_5_productos_Mes[item]);
      }
    })
  }
  Top5Vendedores(){
    this.dashboardService.Top5Vendedores().subscribe((vendedor)=>{
      for(var item  in vendedor.top_5_vendedores){
        this.top_5_vendedores.push(vendedor.top_5_vendedores[item]);
      }
    })
  }
  Top5PeoresVendedores(){
    this.dashboardService.Top5PeoresVendedores().subscribe((vendedor)=>{
      for(var item  in vendedor.top_peores_5_vendedores){
        this.top_5_peores_vendedores.push(vendedor.top_peores_5_vendedores[item]);
      }
    })
  }

}