export interface ProductoModel {
  producto_id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  usaurio_id?: number;
  usuario_id?: number;
  categoria_id: number;
  categoria_id_nombre?: string;
  vendedor_id: number;
  vendedor_id_nombre?: string;
  estado?: string;
  imagen?: string;
  fotosproducto?: FotoProducto[];
  categorias?: Categoria;
  preguntasproducto?: PreguntasProductoModel[];
}

export class FotoProducto {
  foto_id: number;
  producto_id: number;
  foto_Base64: string;
}

export class Categoria {
  categoria_id?: number;
  nombre_categoria?: string;
}

export interface PreguntasProductoModel {
  preguntas_producto_id: number;
  producto_id: number;
  usuario_id: number;
  usuario_id_nombre: number;
  comentario: string;
  comentario_enlazado_id: number;
  comentario_usuario: number;
  respuesta_vendedor: number;
  fecha: string;
}