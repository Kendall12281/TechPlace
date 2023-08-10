export interface UsuarioModel {
    usuario_id: number;
    nombre_completo: string;
    identificacion: string;
    numero_telefono: string;
    correo_electronico: string;
    contrasena: string;
    contrasena_repetir?: string;
    rol_id: number;
    rol_nombre: string;
    nombre_rol?: string;
    desactivado: boolean;
    es_cliente?: boolean;
    es_proveedor?: boolean;
  }