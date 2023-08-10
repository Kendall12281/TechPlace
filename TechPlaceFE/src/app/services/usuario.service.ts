import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class UsuarioService {
    // private apiUrl = "http://192.168.100.40:3000/api/usuarios"; 
    private apiUrl = "http://localhost:3000/api/usuarios"; 
  
    constructor(private http: HttpClient) { }
  
    usuarios: UsuarioModel[] = [
        // Datos de usuarios
      ];

    saveUser(usuario: any): Promise<boolean> {
      const url = `${this.apiUrl}/mantenimiento`;
      // const headers = this.ObtenerJWT();
      return new Promise<boolean>((resolve, reject) => {
        this.http.post(url, usuario).subscribe(
          (response: any) => {
            resolve(true); // Resolvemos la promesa con true
          },
          (error) => {
            console.error('Hubo un error durante la petición HTTP', error);
            resolve(false); // Resolvemos la promesa con false
          }
        );
      });
    }

    ObtenerJWT() {
      //JWT
      const jwt = localStorage.getItem("jwt") || null;
      const headers = new HttpHeaders().set("Authorization", `Bearer ${jwt}`);
      return headers;
    }
    GetUsers(): Observable<any> {
      const headers = this.ObtenerJWT();
      return this.http.get(`${this.apiUrl}/todos`, { headers }).pipe();
    }

    GetUser(usuario_id:Number): any {
      let user:any;
      this.GetUsers().subscribe(
        usuarios => {
          user = usuarios.filter((user:any)=>{
            return user.usuario_id == usuario_id;
          });
          return user;
        },
        error => {
          console.error(user);
        }
      );
    }
}