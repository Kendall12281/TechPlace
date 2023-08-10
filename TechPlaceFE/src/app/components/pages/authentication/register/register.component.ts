import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UsuarioModel } from "src/app/models/usuario.model";
import { AuthService } from "src/app/services/autenticacion.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  validation_message: String = "";
  errorMessage = "";
  hide = true;
  user = {
    nombre_completo: "",
    identificacion: "",
    correo_electronico: "",
    numero_telefono: "",
    contrasena: "",
    contrasena_repetir: "",
    rolNombre: "",
    es_cliente: false,
    es_proveedor: false,
  };

  constructor(private router: Router, private authService: AuthService) {}

  register() {
    if (this.validateData()) {
      if (this.user.es_cliente && this.user.es_proveedor) {
        this.user.rolNombre = "CLIENTE_VENDEDOR";
      } else if (this.user.es_cliente) {
        this.user.rolNombre = "CLIENTE";
      } else if (this.user.es_proveedor) {
        this.user.rolNombre = "VENDEDOR";
      }
      this.authService.register(this.user).subscribe(
        (response) => {
          this.authService.emitRefreshEvent();
          this.router.navigate(["/"]);
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    }
  }

  validateData(): boolean {
    if (this.user.nombre_completo == "") {
      this.validation_message = "Debes ingresar tu nombre";
      return false;
    } else if (this.user.identificacion == "") {
      this.validation_message = "Debes ingresar tu identificación";
      return false;
    } else if (this.user.correo_electronico == "") {
      this.validation_message = "Debes ingresar tu correo electronico";
      return false;
    } else if (this.user.numero_telefono == "") {
      this.validation_message = "Debes ingresar tu telefono";
      return false;
    } else if (this.user.contrasena == "") {
      this.validation_message = "Debes ingresar una contraseña";
      return false;
    } else if (this.user.contrasena_repetir == "") {
      this.validation_message = "Debes repetir la contraseña";
      return false;
    } else if (this.user.contrasena != this.user.contrasena_repetir) {
      this.validation_message = "Las contraseñas no coinciden";
      return false;
    } else if (!this.user.es_cliente && !this.user.es_proveedor) {
      this.validation_message = "Debes seleccionar si eres cliente o vendedor";
      return false;
    }
    this.validation_message = "";
    return true;
  }
}