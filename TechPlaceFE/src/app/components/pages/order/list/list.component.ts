import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CompraModel } from "src/app/models/compra.model";
import { PedidosService } from "src/app/services/pedidos.service";
import { GuardService } from 'src/app/services/guard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent {
  pedidos: CompraModel[];

  esVendedor: boolean;
  esAdmin: boolean;

  displayedColumns: string[] = [
    "Pedido",
    "Direccion",
    "Total",
    "Metodo_Pago",
    "Estado",
    "Acciones",
  ];
  displayedColumnsVendedor: string[] = [
    "Pedido",
    "Cliente",
    "Direccion",
    "Total",
    "Metodo_Pago",
    "Estado",
    "Acciones",
  ];
  dataSource = new MatTableDataSource<CompraModel>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private pedidosService: PedidosService,
    private guardService: GuardService, private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    this.esVendedor = this.EsVendedor();
    this.paginatorIntl.itemsPerPageLabel = "Elementos por página:";
    this.paginatorIntl.firstPageLabel = "Primera";
    this.paginatorIntl.lastPageLabel = "Última";
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {

    if (this.EsVendedor()) {
      this.pedidosService.getPedidosVendedor().subscribe((pedidos) => {
        this.pedidos = pedidos.map((pedido) => {
          let sumTotal = 0;
          pedido.detallescompra.forEach((elemento) => {
            sumTotal = +Number(elemento.total);
          });
          pedido.total = sumTotal;
          return pedido;
        });
        this.dataSource = new MatTableDataSource<CompraModel>(this.pedidos);
        console.log((this.pedidos))
      });
    } else {
      this.pedidosService.getPedidos().subscribe((pedidos) => {
        this.pedidos = pedidos.map((pedido) => {
          let sumTotal = 0;
          pedido.detallescompra.forEach((elemento) => {
            sumTotal = +Number(elemento.total);
          });
          pedido.total = sumTotal;
          return pedido;
        });
        this.dataSource = new MatTableDataSource<CompraModel>(this.pedidos);
      });
    }
  }

  EsVendedor() {
    const usuario: any = JSON.parse(localStorage.getItem("usuario"));
    if(usuario != null){
      this.esAdmin = usuario.rol_id == 1;
      if (usuario.rol_id == 2) {
        return true;
      } else {
        return false;
      }
    }else{
      return false;
    }
  }
}

const ELEMENT_DATA: CompraModel[] = [];
