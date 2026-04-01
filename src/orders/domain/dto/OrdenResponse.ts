import { Orden } from '../entities/Orden';

export class OrdenResponse {
  id_orden: number;
  id_usuario: number;
  id_repartidor?: number | null;
  fecha_orden: Date;
  estado_orden: string;
  monto_total: number;
  descripcion?: string;
  direccion: string;
  metodo_pago: {
    tipo: 'tarjeta' | 'efectivo';
    ultimos4?: string;
  };
  productos: any[];

  constructor(orden: Orden) {
    this.id_orden = orden.id_orden;
    this.id_usuario = orden.id_usuario;
    this.id_repartidor = orden.id_repartidor;
    this.fecha_orden = orden.fecha_orden;
    this.estado_orden = orden.estado_orden;
    this.monto_total = orden.monto_total;
    this.descripcion = orden.descripcion;
    this.direccion = orden.direccion;
    this.metodo_pago = orden.metodo_pago;
    this.productos = orden.productos;
  }
}
