import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DireccionModel } from 'src/app/models/direccion.model';
import { MetodosPagoModel } from 'src/app/models/metodo_pago.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ModalService } from 'src/app/services/modal.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GuardService } from 'src/app/services/guard.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  usuario_id = 0;
  hide = true;
  user:any = {
    nombre_completo: '',
    identificacion: '',
    correo_electronico: '',
    numero_telefono: '',
    contrasena: '',
    contrasena_repetir: '',
    rol_nombre: '',
    tipo_perfil: null,
    desactivado : null
  }


  lista_provincia:[any]|any = [];
  lista_canton:[any]|any = [];
  lista_distrito:[any]|any = [];

 direccion_data:DireccionModel = {
    usuario_id: 1,
    provincia: '',
    provinciaid: '',
    canton: '',
    cantonid: '',
    distrito: '',
    distritoid: '',
    direccion_exacta: '',
    codigo_postal: '',
    telefono: ''
    
  }
  mensaje_direccion:string ='';
  lista_direccion:[DireccionModel]|any = [];

  metodo_pago_data:MetodosPagoModel = {
    usuario_id: 1,
    tipo_pago: '',
    proveedor: '',
    numero_cuenta: '',
    fecha_expiracion: '',
  }
  mensaje_metodo_pago:string ='';
  lista_metodo_pago:[MetodosPagoModel]|any = [];

  mensaje_usuario:string ='';
  constructor(private ubicacionService: UbicacionService,
     private usuarioService: UsuarioService, private route: ActivatedRoute,
     private usuariosService: UsuarioService, public modal: ModalService,
     private router: Router,private guardService: GuardService){

  }
  ngOnInit(): void {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    this.ubicacionService.getProvincias().subscribe((provincias: any)=> {
      let lista_provincia_carga:[]|any = [];
      for (let id in provincias) {
        let item: any = {id: id, nombre: provincias[id]};
        if (provincias.hasOwnProperty(id)) {
          lista_provincia_carga.push(item);
        }
      }
      this.lista_provincia = lista_provincia_carga;
    });

    this.route.queryParams.subscribe(params => {
      const parametro = params['id'];
      if(parametro != undefined){
        this.usuario_id = parametro;
        setTimeout(()=>{

          this.loadData();
        },500)
      }
      });

      console.log(this.user)
  }

  loadData(){
    let usuario:any;
    this.usuariosService.GetUsers().subscribe(
      usuarios => {
        usuario = usuarios.filter((user:any)=>{
          return user.usuario_id == this.usuario_id;
        })[0];
        this.user = usuario;
        this.user.desactivado = usuario.desactivado.toString();
        this.user.contrasena_repetir = this.user.contrasena;
        this.user.tipo_perfil = this.user.roles.nombre_rol;
        this.lista_direccion = usuario.direcciones;
        this.lista_metodo_pago = usuario.metodospago;
        this.user.tipo_perfil = usuario.tipo_perfil.toLowerCase()
      },
      error => {
        console.error(error);
      }
    );
  }

  save(){
    if(this.validate()){
      let desactivado : boolean
      if(this.user.desactivado.trim() == "true"){
        desactivado = true;
      }else{
        desactivado = false;
      }
      let data = {
        usuario_id: Number(this.usuario_id),
        nombre_completo: this.user.nombre_completo,
        identificacion: this.user.identificacion,
        correo_electronico: this.user.correo_electronico,
        numero_telefono: this.user.numero_telefono,
        contrasena: this.user.contrasena,
        rolNombre: this.user.tipo_perfil,
        lista_direccion: this.lista_direccion,
        lista_metodo_pago: this.lista_metodo_pago,
        desactivado: desactivado
      }
      

      console.log("desactivado: "+ this.user.desactivado+ "despues: "+Boolean(this.user.desactivado))
      let response =  this.usuarioService.saveUser(data);
      if(response){
          this.modal.openSuccessDialog();
          this.router.navigate(["/maintenance/user"]);
      }
    }
  }

  validate():boolean{
    if(this.user.nombre_completo == ''){
      this.mensaje_usuario = "Debe ingresar el nombre del usuario";
      return false;
    }else if(this.user.identificacion == ''){
      this.mensaje_usuario = "Debe ingresar la identificacion del usuario";
      return false;
    }else if(this.user.correo_electronico == ''){
      this.mensaje_usuario = "Debe ingresar el correo electronico del usuario";
      return false;
    }else if(this.user.numero_telefono == ''){
      this.mensaje_usuario = "Debe ingresar el telefono del usuario";
      return false;
    }else if(this.user.contrasena == ''){
      this.mensaje_usuario = "Debe ingresar una contraseña";
      return false;
    }else if(this.user.contrasena_repetir == ''){
      this.mensaje_usuario = "Debe repetir la contraseña";
      return false;
    }else if(this.user.contrasena != this.user.contrasena_repetir){
      this.mensaje_usuario = "Las contraseñas no coinciden";
      return false;
    }else if(this.user.contrasena != this.user.contrasena_repetir){
      this.mensaje_usuario = "Las contraseñas no coinciden";
      return false;
    }else if(this.user.tipo_perfil == ''){
      this.mensaje_usuario = "Debe seleccionar un perfil";
      return false;
    }else if((this.lista_direccion == null || this.lista_direccion.length == 0) && !['ADMINISTRADOR','VENDEDOR'].includes(this.user.tipo_perfil) ){
      this.mensaje_usuario = "Debe agregar al menos una dirección";
      return false;
    }else if((this.lista_metodo_pago == null || this.lista_metodo_pago.length == 0) && !['ADMINISTRADOR','VENDEDOR'].includes(this.user.tipo_perfil) ){
      this.mensaje_usuario = "Debe agregar al menos un metodo de pago";
      return false;
    }
    return true;
  }

  onSelectionChangeProvincia(event: any) {

    if(this.direccion_data.provinciaid != ''){
      this.ubicacionService.getCantones(parseInt(this.direccion_data.provinciaid)).subscribe((cantones: any)=> {
        let lista_canton_carga:[]|any = [];
        for (let id in cantones) {
          let item: any = {id: id, nombre: cantones[id]};
          if (cantones.hasOwnProperty(id)) {
            lista_canton_carga.push(item);
          }
        }
        this.lista_canton = lista_canton_carga;
      });
    }

    this.direccion_data.cantonid = '';
    this.lista_distrito = [];
    this.direccion_data.distritoid = '';
  }
  onSelectionChangeCanton(event: any) {
    if(this.direccion_data.cantonid != ''){
      this.ubicacionService.getDistritos(parseInt(this.direccion_data.provinciaid),parseInt(this.direccion_data.cantonid)).subscribe((cantones: any)=> {

        let lista_distrito_carga:[]|any = [];
        for (let id in cantones) {
          let item: any = {id: id, nombre: cantones[id]};
          if (cantones.hasOwnProperty(id)) {
            lista_distrito_carga.push(item);
          }
        }
        this.lista_distrito = lista_distrito_carga;
      });
    }
  }

  addLocation(){
    if(this.validateLocationToAdd()){
      this.lista_direccion.push(this.direccion_data);
      this.cleanLocationData()
    }
  }

  cleanLocationData(){
    this.direccion_data = {
      usuario_id: 1,
      provincia: '',
      provinciaid: '',
      canton: '',
      cantonid: '',
      distrito: '',
      distritoid: '',
      direccion_exacta: '',
      codigo_postal: '',
      telefono: '',
      guid_dinamico: 0
    };
    this.mensaje_direccion = '';
  }

  validateLocationToAdd():boolean{
    if(this.direccion_data.provinciaid == ''){
      this.mensaje_direccion = 'Debe seleccionar una provincia';
      return false;
    }
    else if(this.direccion_data.cantonid == ''){
      this.mensaje_direccion = 'Debe seleccionar un canton';
      return false;
    }
    else if(this.direccion_data.distritoid == ''){
      this.mensaje_direccion = 'Debe seleccionar un distrito';
      return false;
    }
    else if(this.direccion_data.codigo_postal == ''){
      this.mensaje_direccion = 'Debe ingresar el codigo postal';
      return false;
    }
    else if(this.direccion_data.direccion_exacta == ''){
      this.mensaje_direccion = 'Debe ingresar una direccion exacta';
      return false;
    }
    else if(this.direccion_data.telefono == ''){
      this.mensaje_direccion = 'Debe ingresar un telefono para la respectiva dirección';
      return false;
    }

    this.direccion_data.provincia = this.lista_provincia.filter((item:any)=>{
      return item.id == this.direccion_data.provinciaid;
    })[0].nombre;
    this.direccion_data.canton = this.lista_canton.filter((item:any)=>{
      return item.id == this.direccion_data.cantonid;
    })[0].nombre;
    this.direccion_data.distrito = this.lista_distrito.filter((item:any)=>{
      return item.id == this.direccion_data.distritoid;
    })[0].nombre;

    this.direccion_data.es_dinamico = true;
    this.direccion_data.guid_dinamico = Math.random() * (100000 - 1) + 1;

    return true;
  }

  deleteLocation(item:DireccionModel){
    if(item.es_dinamico){
      this.lista_direccion = this.lista_direccion.map((direccion:any) => direccion.guid_dinamico !== item.guid_dinamico);
    }else{
      this.lista_direccion = this.lista_direccion.map((direccion:DireccionModel) => {
        if(direccion.direccion_id == item.direccion_id){
          direccion.eliminado = true;
        }
        return direccion;
      })
    }
  }


  addPayMethod(){
    if(this.validatePayMethodToAdd()){
      this.lista_metodo_pago.push(this.metodo_pago_data);
      this.cleanPayMethodData()
    }
  }

  cleanPayMethodData(){
    this.metodo_pago_data = {
      usuario_id: 1,
      tipo_pago: '',
      proveedor: '',
      numero_cuenta: '',
      fecha_expiracion: '',
      guid_dinamico: 0
    }
    this.mensaje_metodo_pago = '';
  }

  validatePayMethodToAdd():boolean{
    if(this.metodo_pago_data.tipo_pago == ''){
      this.mensaje_metodo_pago = 'Debe seleccionar un metodo de pago';
      return false;
    }
    else if(this.metodo_pago_data.tipo_pago != 'Efectivo'){
      if(this.metodo_pago_data.proveedor == ''){
        this.mensaje_metodo_pago = 'Debe seleccionar un tipo de tarjeta';
        return false;
      } 
      else if(this.metodo_pago_data.numero_cuenta == ''){
        this.mensaje_metodo_pago = 'Debe ingresar el numero de tarjeta';
        return false;
      }
      else if(this.metodo_pago_data.fecha_expiracion == ''){
        this.mensaje_metodo_pago = 'Debe ingresar la fecha de expiracion';
        return false;
      }
    }

    this.metodo_pago_data.es_dinamico = true;
    this.metodo_pago_data.guid_dinamico = Math.random() * (100000 - 1) + 1;

    return true;
  }

  deletePayMethod(item:MetodosPagoModel){
    if(item.es_dinamico){
      this.lista_metodo_pago = this.lista_metodo_pago.filter((metodo_pago:any) => metodo_pago.guid_dinamico !== item.guid_dinamico);
    }else{
      this.lista_metodo_pago = this.lista_metodo_pago.map((metodo_pago:MetodosPagoModel) => {
        if(metodo_pago.metodo_pago_id == item.metodo_pago_id){
          item.eliminado = true;
        }
        return metodo_pago;
      })
    }
  }
}
