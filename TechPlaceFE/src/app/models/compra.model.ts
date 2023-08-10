export interface CompraModel {
    compra_id: number;
    usuario_id: number;
    usuarios?: Usuarios;
    direccion_id: number;
    direccion_id_nombre: string;
    metodo_pago_id: number;
    metodo_pago_id_nombre: string;
    estado_pedido_id: number;
    estadopedido?: EstadoPedido;
    direcciones?: Direcciones;
    metodospago?: MetodoPago;
    total: number;
    detallescompra: DetalleCompra[];
  }

  export class Usuarios {
    nombre_completo?: number;
    identificacion?: number;
    numero_telefono?: string;
    correo_electronico?: string;
  }

  export class EstadoPedido {
    estado_pedido_id?: number;
    nombre_estado?: string;
  }

  export class Direcciones {
    direccion_id?: number;
    usuario_id?: number;
    provincia?: string;
    canton?: string;
    distrito?: string;
    direccion_exacta?: string;
    codigo_zip?: string;
    telefono?: string;
  } 

  export class DetalleCompra {
    producto_id?: number;
    subtotal?: number;
    impuesto?: number;
    total?: number;
  } 

  export class MetodoPago {
    producto_id?: number;
    tipo_pago?: string;
    proveedor?: string;
  } 