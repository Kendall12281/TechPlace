import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  validation_message:String = '';
  errorMessage: string;
  hide = true;
    user = {
        email: '',
        password: ''
    }

    constructor(
         private router: Router,
         private authService: AuthService
    ) {}


    async login(){
      this.authService.login(this.user.email, this.user.password).subscribe(
        (response) => {
          this.authService.emitRefreshEvent();
          this.router.navigate(["/"]);
        },
        (error) => {
          this.validation_message = "Usuario/Contraseña incorrectos"
          this.errorMessage = error;
        }
      );
    }

    validateData():boolean{
      if(this.user.email == ''){
        this.validation_message = "Debe ingresar un correo electronico";
        return false;
      }else if(this.user.password == ''){
        this.validation_message = "Debe ingresar una contraseña";
        return false;
      }
      return true;
    }
}