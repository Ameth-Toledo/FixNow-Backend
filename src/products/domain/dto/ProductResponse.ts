import { Product, Especificacion } from '../entities/Product';

export class ProductResponse {
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

  constructor(product: Product) {
    this.id_producto   = product.id_producto;
    this.sku           = product.sku;
    this.nombre        = product.nombre;
    this.descripcion   = product.descripcion;
    this.precio_venta  = product.precio_venta;
    this.stock_actual  = product.stock_actual;
    this.imagen_url    = product.imagen_url;
    this.id_categoria  = product.id_categoria;
    this.categoria     = product.categoria;
    this.id_empresa    = product.id_empresa;
    this.fecha_registro = product.fecha_registro;
    this.especificaciones = product.especificaciones;
  }
}
