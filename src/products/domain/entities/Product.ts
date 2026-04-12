export interface Especificacion {
  id_especificacion: number;
  clave: string;
  valor: string;
}

export interface Product {
  id_producto: number;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precio_venta: number;
  stock_actual: number;
  imagen_url: string | null;
  id_categoria: number | null;
  categoria:    string | null;
  id_empresa:   number | null;
  fecha_registro: Date;
  especificaciones?: Especificacion[];
}
