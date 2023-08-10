import { Component, ViewChild,AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleCompraModel } from 'src/app/models/detalle_compra.model';
import { PedidosService } from 'src/app/services/pedidos.service';

import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import { CarritoModel } from 'src/app/models/carrito.model';
import { ModalService } from 'src/app/services/modal.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/autenticacion.service';
import { DireccionModel } from 'src/app/models/direccion.model';
import { MetodosPagoModel } from 'src/app/models/metodo_pago.model';
import { GuardService } from 'src/app/services/guard.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  carrito: CarritoModel[] = [];
  mensaje_direccion:string ='';
  lista_direccion:[DireccionModel]|any = [];
  direccion:DireccionModel|any = [];
  location:String;
  mensaje_metodo_pago:string ='';
  lista_metodo_pago:[MetodosPagoModel]|any = [];
  metodo_pago:MetodosPagoModel|any = [];
  payMethod:String;
  pedido: any;
  subtotal: any = 0;
  impuesto: any= 0;
  total: any= 0;
  userData: any;
  userDataStorage: any;
  mensaje:string ='';


  displayedColumns: string[] = ['Producto', 'Cantidad', 'Costo', 'Subtotal', 'Impuesto', 'Total','Accion'];
  dataSource = new MatTableDataSource<CarritoModel>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, 
    private paginatorIntl: MatPaginatorIntl, private pedidosService: PedidosService,
    private carritoService: CarritoService, public modal: ModalService, 
    private usuarioService: UsuarioService, private authService: AuthService,
    private guardService: GuardService) {}
  ngOnInit(): void {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
      this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
      this.paginatorIntl.firstPageLabel = 'Primera';
      this.paginatorIntl.lastPageLabel = 'Última';
      this.paginatorIntl.nextPageLabel = 'Siguiente';
      this.paginatorIntl.previousPageLabel = 'Anterior';    

      this.carritoService.carrito$.subscribe(carrito => {
        this.carrito = carrito;
      });
      this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(){
        this.dataSource = new MatTableDataSource<any>(this.carrito);
        this.carrito.forEach((elemento) => {
          this.subtotal =+ Number(elemento.cantidad) * Number(elemento.costo);
          this.impuesto =+ (Number(elemento.cantidad) * Number(elemento.costo)) * 0.13;
          this.total =+ (Number(elemento.cantidad) * Number(elemento.costo)) + (Number(elemento.cantidad) * Number(elemento.costo)) * 0.13;
        });
        if(this.carrito.length == 0){
          this.router.navigateByUrl('/');
        }

        this.userDataStorage =this.authService.userData();

        if(this.userDataStorage == null || this.userDataStorage.nombre_rol=='ADMINISTRADOR' || this.userDataStorage.nombre_rol=='VENDEDOR'){
          this.router.navigate(["/"]);
        }

        this.usuarioService.GetUsers().subscribe(
          usuarios => {
            this.userData = usuarios.filter((user:any)=>{
              return user.usuario_id == this.userDataStorage.usuario_id;
            })[0];
            this.lista_direccion = this.userData.direcciones;
            this.lista_metodo_pago = this.userData.metodospago;
          },
          error => {
            console.error(error);
          }
        );

      }
 onSelectionChangeLocation(event: any) {
    if(this.location != ''){
      this.direccion = this.lista_direccion.filter((item:any)=>{
        return item.direccion_id == this.location;
      })[0];
    }
  }
  onSelectionChangePayMethod(event: any) {
    if(this.payMethod != ''){
      this.metodo_pago = this.lista_metodo_pago.filter((item:any)=>{
        return item.metodo_pago_id == this.payMethod;
      })[0];
    }
  }
    removeProduct(id:number){
      this.carritoService.removeArticleByID(id);
      this.loadData();
      this.modal.openSuccessDialog()
    }

    save(){
      if(this.validate()){
        let detalleCompra:any[] = []

        this.carrito.forEach((producto:any)=>{
          let productoFormato = {
            producto: producto.producto_id,
            cantidad: producto.cantidad,
            subtotal: producto.cantidad * producto.costo,
            impuesto: (producto.cantidad * producto.costo) * 0.13,
            total: (producto.cantidad * producto.costo)+(producto.cantidad * producto.costo) * 0.13,
          }
          detalleCompra.push(productoFormato);
        })

        let data = {
          usuario_id: this.userData.usuario_id,
          direccion_id: this.direccion.direccion_id,
          metodo_pago_id: this.metodo_pago.metodo_pago_id,
          estado_pedido_id: 1,
          detalle_compra: detalleCompra
        };
        let response = this.pedidosService.saveOrder(data);
        if(response){
          this.carritoService.cleanCar();
          this.modal.openSuccessDialog();
          this.router.navigate(["/order/list"]);
        }else{
          this.modal.openErrorDialog();
        }
      }
    }

    validate():Boolean{
      console.log(this.payMethod, this.location, this.carrito)
      if(this.payMethod == undefined || this.payMethod == ''){
        this.mensaje_metodo_pago = "Debe seleeccionar un metodo de pago o ingresar a su perfil y crearlo";
        return false;
      }
      this.mensaje_metodo_pago = '';
      if(this.location == undefined || this.location == ''){
        this.mensaje_direccion = "Debe seleeccionar una dirección o ingresar a su perfil y crearla";
        return false;
      }
      this.mensaje_direccion = '';

      if(this.carrito == null || this.carrito.length <= 0){
        this.mensaje == "Debe agregar al menos un producto al carrito"
        return false;
      }
      this.mensaje = '';
      return true;
    }
}

const ELEMENT_DATA: CarritoModel[] = []
