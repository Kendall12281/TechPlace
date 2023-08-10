import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiUrl = "http://localhost:3000/api/dashboard/"; // Reemplaza 'api/usuarios' por la URL de tu API
  // private apiUrl = "http://192.168.100.40:3000/api/dashboard/"; 

  constructor(private http: HttpClient) {}

  //Admin

  ObtenerJWT() {
    //JWT
    const jwt = localStorage.getItem("jwt") || null;
    const headers = new HttpHeaders().set("Authorization", `Bearer ${jwt}`);
    return headers;
  }

  ObtenerCantidadComprasDia(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}comprasDia`, { headers }).pipe();
  }
  Top5ProductosMes(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}topProductos`, { headers }).pipe();
  }
  Top5Vendedores(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}topVendedores`, { headers }).pipe();
  }
  Top5PeoresVendedores(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}peorVendedores`, { headers }).pipe();
  }


  //Vendedor
  ProductoMasVendido(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}vendedor/productoMasVendido`, { headers }).pipe();
  }
  ClienteMasCompras(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}vendedor/clienteMasCompras`, { headers }).pipe();
  }
  CalificacionVendedor(): Observable<any> {
    const headers = this.ObtenerJWT();
    return this.http.get(`${this.apiUrl}vendedor/calificaciones`, { headers }).pipe();
  }

}