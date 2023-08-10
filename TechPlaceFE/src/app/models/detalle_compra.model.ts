export interface DetalleCompraModel {
    detalle_compra_id: number;
    compra_id: number;
    producto_id: number;
    producto_id_nombre?: string;
    producto_id_usuario_nombre?: string;
    cantidad: number;
    subtotal: number;
    impuesto: number;
    total: number;
    // test: any
  }