import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CompraModel } from "../models/compra.model";


@Injectable({
  providedIn: "root",
})
export class PedidosService {
  
  private apiUrl = "http://localhost:3000/api/"; 
  // private apiUrl = "http://192.168.100.40:3000/api/"; 

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<CompraModel[]> {
    const usuario : any = JSON.parse(localStorage.getItem("usuario"));
    console.log("Usuario cliente:"+JSON.stringify(usuario))
    const url = `${this.apiUrl}pedidos/cliente`;
    const data = { usuario_id: usuario.usuario_id };

    return this.http.post<CompraModel[]>(url,data).pipe();
  }

  getPedidosVendedor(): Observable<CompraModel[]> {
    const usuario : any = JSON.parse(localStorage.getItem("usuario"));
    console.log("usuario vendedor: "+usuario)
    const url = `${this.apiUrl}pedidos/vendedor`;
    const data = { usuario_id: usuario.usuario_id };

    return this.http.post<CompraModel[]>(url,data).pipe();
  }

  getPedidoDetail(id_pedido:number): Observable<CompraModel> {
    const url = `${this.apiUrl}pedidos/detalle`;
    const data = { compra_id: id_pedido };

    return this.http.post<CompraModel>(url,data).pipe();
  }

    CambiarEstadoPedido(compra:any,estado:any):void{
    const url = `${this.apiUrl}pedidos/actualizarEstado`;
    const data = { compra_id: compra, estado_id: estado };

     this.http.post<CompraModel>(url,data).pipe().subscribe();
  }
  
  saveOrder(order: any): Promise<boolean> {
    const url = `${this.apiUrl}pedidos/guardar`;
    console.log('data order',order)
    return new Promise<boolean>((resolve, reject) => {
      this.http.post(url, order).subscribe(
        (response: any) => {
          console.log(response.message); // Producto creado
          resolve(true); // Resolvemos la promesa con true
        },
        (error) => {
          console.error('Hubo un error durante la petición HTTP', error);
          resolve(false); // Resolvemos la promesa con false
        }
      );
    });
  }

}