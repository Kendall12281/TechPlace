import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { tap, catchError } from "rxjs/operators";
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu API
  // private apiUrl = "http://192.168.100.40:3000/api"; 

  refreshEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

   login(correo_electronico: string, contrasena: string): Observable<any> {
    const credentials = {
            correo_electronico: correo_electronico,
            contrasena: contrasena,
          };

    return this.http.post<any>(`${this.apiUrl}/iniciarSesion`, credentials).pipe(
      tap(response => {
        // Store the token in local storage or cookies
        localStorage.setItem('jwt', response.jwt);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
      }),
      catchError((error) => {
        return (error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('jwt');
  }

  isLoggedIn(): boolean {
    // Verificar si el token JWT está presente en el almacenamiento local (localStorage)
    return localStorage.getItem('jwt') !== null;
  }

  getJWT(): string {
     return localStorage.getItem('jwt') !== null ? localStorage.getItem('jwt').toString() : null;
  }

  emitRefreshEvent(): void {
    this.refreshEvent.emit();
  }

  userData(): UsuarioModel | null {
    const storedData = localStorage.getItem('usuario');
    if(storedData !== null){
      const userData: UsuarioModel = JSON.parse(storedData);
      return userData;
    }else{
      return null;
    }
  }

     register(data:any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/usuarios/crearUsuario`, data).pipe(
            tap(response => {
              // Store the token in local storage or cookies
              localStorage.setItem('jwt', response.jwt);
              localStorage.setItem('usuario', JSON.stringify(response.user));
            }),
            catchError((error) => {
         
              return (error);
            })
          );
    }
}