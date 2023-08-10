export interface DireccionModel
 {
    direccion_id?: number;
    usuario_id: number;
    provincia?: string;
    provinciaid?: string;
    canton?: string;
    cantonid?: string;
    distrito?: string;
    distritoid?: string;
    direccion_exacta: string;
    codigo_postal: string;
    telefono: string;
    es_dinamico?: boolean;
    guid_dinamico?: number;
    eliminado?:Boolean;
  }