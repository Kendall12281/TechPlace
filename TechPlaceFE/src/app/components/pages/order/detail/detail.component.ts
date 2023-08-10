import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleCompraModel } from 'src/app/models/detalle_compra.model';
import { PedidosService } from 'src/app/services/pedidos.service';
import { EvaluacionesService } from 'src/app/services/evaluaciones.service';

import { ActivatedRoute, Router } from '@angular/router';


import { MatDialog } from '@angular/material/dialog';
import { GuardService } from 'src/app/services/guard.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  esVendedor: boolean;
  parameter: Number | null;
  pedido: any;
  subtotal: any = 0;
  impuesto: any = 0;
  total: any = 0;
  estado: any = "";
  estado_pedido_id: number;
  compra_id: number;
  existeEvaluacionCompra: boolean;
  usuario_id: number
  existeEvaluacionVendedor: boolean
  existeEvaluacionCliente: boolean
  evaluacion_id : number
  

  //modal

  modalAbierta = false;

  displayedColumns: string[] = ['Producto','Proveedor', 'Cantidad', 'Subtotal', 'Impuesto', 'Total', 'Accion'];
  dataSource = new MatTableDataSource<DetalleCompraModel>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, 
    private guardService: GuardService, private evaluacionesService: EvaluacionesService, private paginatorIntl: MatPaginatorIntl, private pedidosService: PedidosService, public dialog: MatDialog,) {
    this.esVendedor = this.router.url.includes("detailseller");
  }
  ngOnInit(): void {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    this.esVendedor = this.EsVendedor();
    this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
    this.paginatorIntl.firstPageLabel = 'Primera';
    this.paginatorIntl.lastPageLabel = 'Última';
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.previousPageLabel = 'Anterior';

    this.route.queryParams.subscribe(params => {
      const parametro = params['id'];
      this.parameter = parametro;
      this.compra_id = Number(parametro);
      this.loadData();
    });


    this.ExisteEvaluacionCompra();

    // this.YaCompletoEvaluacionVendedor();
     this.YaCompletoEvaluacionCliente();
  }

  //modal
  review: any = {};

  EnviarCalificacion() {

    if (this.review.calificacion > 0 && this.review.calificacion < 6) {

      this.review.compra_id = this.compra_id;
      this.review.cliente_id = this.usuario_id

      const evaluacion = {
        compra_id: this.review.compra_id,
        cliente_id: this.usuario_id,
        comentario_cliente: this.review.comentario,
        calificacion_vendedor: this.review.calificacion,
        calificacion_cliente : this.review.calificacion,
        comentario_vendedor : this.review.comentario,
        evaluacion_id : this.evaluacion_id

      }
      if(this.esVendedor){

        this.evaluacionesService.EvaluarCliente(evaluacion);
        this.CambiarEstadoPedido();
      }else{
        this.evaluacionesService.EvaluarVendedor(evaluacion);
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      }

      this.modalAbierta = false;

    }

    console.log(this.review)
  }

  ExisteEvaluacionCompra() {
    this.evaluacionesService.ExisteEvaluacionCompra(this.compra_id).subscribe((value) => {
      this.existeEvaluacionCompra = value;
    })


  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }

  loadData() {
    if (this.parameter == null || this.parameter.toString() == '') {
      this.router.navigateByUrl('/');
    } else {
      const product_id = Number(this.parameter);
      this.pedidosService.getPedidoDetail(product_id).subscribe((pedido) => {
        this.pedido = pedido ? pedido : null;
        console.log('order', this.pedido);
        this.estado = this.pedido?.estadopedido.nombre_estado;
        this.estado_pedido_id = this.pedido.estado_pedido_id
        this.compra_id = this.pedido.compra_id;
        this.usuario_id = this.pedido.usuario_id

        console.log(this.pedido)


        pedido.detallescompra.forEach((elemento) => {
          this.subtotal += Number(elemento.subtotal);
          this.impuesto += Number(elemento.impuesto);
          this.total += Number(elemento.total);
        });

        this.dataSource = new MatTableDataSource<any>(pedido?.detallescompra);

      });
    }
  }

  CambiarEstadoPedido() {
    this.pedidosService.CambiarEstadoPedido(this.pedido.compra_id, 3);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  EsVendedor() {
    const usuario: any = JSON.parse(localStorage.getItem("usuario"));
    if (usuario.rol_id == 2) {
      return true;
    } else {
      return false;
    }
  }

  YaCompletoEvaluacionVendedor(){
    const data = {
      compra_id: this.compra_id
    }
    const resultado = this.evaluacionesService.YaCompletoEvaluacionVendedor(data).subscribe((value)=>{
      console.log(value)
    });
    if(resultado){
      return true;
    }else{
      return false;
    }
  }
  YaCompletoEvaluacionCliente(){
    const data = {
      compra_id: this.compra_id
    }
     this.evaluacionesService.YaCompletoEvaluacionCliente(data).subscribe((value)=>{
      console.log(value)

      this.evaluacion_id = value.evaluacion_id
      if(value.cliente_id == null){
        this.existeEvaluacionCliente = false;
      }else{
        this.existeEvaluacionCliente = true;
    }

      if(value.vendedor_id == null){
        this.existeEvaluacionVendedor = false;
      }else{
        this.existeEvaluacionVendedor = true;
      }
    })
   
  }

}
const ELEMENT_DATA: DetalleCompraModel[] = [
  {
    detalle_compra_id: 1,
    compra_id: 1,
    producto_id: 1,
    producto_id_nombre: 'Laptop',
    producto_id_usuario_nombre: 'Fernando',
    cantidad: 10,
    subtotal: 3000,
    impuesto: (3000 * 0.13),
    total: (3000 * 0.13) + 3000
  },
  {
    detalle_compra_id: 1,
    compra_id: 1,
    producto_id: 1,
    producto_id_nombre: 'Laptop',
    producto_id_usuario_nombre: 'Fernando',
    cantidad: 10,
    subtotal: 3000,
    impuesto: (3000 * 0.13),
    total: (3000 * 0.13) + 3000
  },
  {
    detalle_compra_id: 1,
    compra_id: 1,
    producto_id: 1,
    producto_id_nombre: 'Laptop',
    producto_id_usuario_nombre: 'Fernando',
    cantidad: 10,
    subtotal: 3000,
    impuesto: (3000 * 0.13),
    total: (3000 * 0.13) + 3000
  },
  {
    detalle_compra_id: 1,
    compra_id: 1,
    producto_id: 1,
    producto_id_nombre: 'Laptop',
    producto_id_usuario_nombre: 'Fernando',
    cantidad: 10,
    subtotal: 3000,
    impuesto: (3000 * 0.13),
    total: (3000 * 0.13) + 3000
  }






]