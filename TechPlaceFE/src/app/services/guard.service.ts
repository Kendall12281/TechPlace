import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { tap, catchError } from "rxjs/operators";
import { UsuarioModel } from '../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
    constructor(private http: HttpClient, private router: Router, 
        private auth: AuthService, private route: ActivatedRoute) { }
  
    ValidatePermission(url:string){
        console.log('ruta recibida', url);
        let path:string = url == '/' ? 'mainpage' : url;
        let userData: UsuarioModel = this.auth.userData();
        console.log('rol', userData);

        if(userData == null){
            if(!['mainpage','product/list','product/detail'].includes(path)){
                this.router.navigate(['/'])
            }
        }else if(userData.nombre_rol == 'ADMINISTRADOR'){
            if(['product/list','product/detail'].includes(path)){
                this.router.navigate(['/'])
            }
        }else if(userData.nombre_rol == 'CLIENTE'){
            if(!['mainpage','product/list','product/detail','order/list', 'order/detail','order/cart', 'profile'].includes(path)){
                this.router.navigate(['/'])
            }
        }else if(userData.nombre_rol == 'VENDEDOR'){
            if(!['mainpage','product/management','product/list','product/detail','product/create','product/edit','order/list', 'order/detail','order/detailseller', 'profile'].includes(path)){
                this.router.navigate(['/'])
            }
        }else if(userData.nombre_rol == 'CLIENTE_VENDEDOR'){
            if(!['mainpage','product/list','product/detail','product/management','product/create','product/edit','order/list', 'order/detail', 'profile'].includes(path)){
                this.router.navigate(['/'])
            }
        }
    }

}