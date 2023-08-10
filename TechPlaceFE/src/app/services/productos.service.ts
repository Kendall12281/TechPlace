import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductoModel } from "../models/producto.model";

@Injectable({
  providedIn: "root",
})
export class ProductoService {
  
  private apiUrl = "http://localhost:3000/api/"; 
  // private apiUrl = "http://192.168.100.40:3000/api/"; 

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductoModel[]> {
    return this.http.get<ProductoModel[]>(`${this.apiUrl}productos`).pipe();
  }

  getProdutoDetail(id_producto:number): Observable<ProductoModel> {
    const url = `${this.apiUrl}productos/detalle`;
    const data = { producto_id: id_producto };

    return this.http.post<ProductoModel>(url,data).pipe();
  }

  getProductosVendedor(): Observable<ProductoModel[]> {
    const usuario : any = JSON.parse(localStorage.getItem("usuario"));
    const url = `${this.apiUrl}productos/vendedor`;
    const data = { usuario_id: usuario.usuario_id };
    return this.http.post<ProductoModel[]>(url,data).pipe();
  }

  saveProduct(producto: any, esNuevo: boolean): Promise<boolean> {
    const url = esNuevo ? `${this.apiUrl}productos/guardar` : `${this.apiUrl}productos/modificar`;
  
    // Devolvemos una promesa
    return new Promise<boolean>((resolve, reject) => {
      this.http.post(url, producto).subscribe(
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
  eliminarProduct(productoid:number):void{
    const url = `${this.apiUrl}productos/eliminar`;
    const data = { producto_id: productoid };
    this.http.post(url,data).pipe().subscribe();
  }

  HacerPreguntaCliente(data:any){
    const url = `${this.apiUrl}productos/hacerPreguntaCliente`;
    this.http.post(url,data).pipe().subscribe();
  }
  ResponderPreguntaVendedor(data:any){
    const url = `${this.apiUrl}productos/responderPreguntaVendedor`;
    this.http.post(url,data).pipe().subscribe();
  }
}