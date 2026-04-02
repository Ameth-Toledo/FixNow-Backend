import { Orden } from '../entities/Orden';

export class OrdenResponse {
  id_orden: number;
  id_usuario: number;
  nombre_cliente?: string;
  id_repartidor?: number | null;
  id_empresa?: number | null;
  nombre_empresa?: string | null;
  fecha_orden: Date;
  estado_orden: string;
  monto_total: number;
  descripcion?: string;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
  metodo_pago: {
    tipo: 'tarjeta' | 'efectivo';
    ultimos4?: string;
  };
  productos: any[];

  constructor(orden: Orden) {
    this.id_orden = orden.id_orden;
    this.id_usuario = orden.id_usuario;
    this.nombre_cliente = orden.nombre_cliente;
    this.id_repartidor = orden.id_repartidor;
    this.id_empresa = orden.id_empresa;
    this.nombre_empresa = orden.nombre_empresa;
    this.fecha_orden = orden.fecha_orden;
    this.estado_orden = orden.estado_orden;
    this.monto_total = orden.monto_total;
    this.descripcion = orden.descripcion;
    this.direccion = orden.direccion;
    this.latitud = orden.latitud;
    this.longitud = orden.longitud;
    this.metodo_pago = orden.metodo_pago;
    this.productos = orden.productos;
  }
}
