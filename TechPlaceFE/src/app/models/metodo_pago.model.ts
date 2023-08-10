export interface MetodosPagoModel {
    metodo_pago_id?: number;
    usuario_id: number;
    tipo_pago: string;
    proveedor?: string;
    numero_cuenta?: string;
    fecha_expiracion?: string;
    es_dinamico?: boolean;
    guid_dinamico?: number;
    eliminado?: Boolean;
  }