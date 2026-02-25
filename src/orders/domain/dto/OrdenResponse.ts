import { Orden } from '../entities/Orden';

export class OrdenResponse {
  id_orden: number;
  id_usuario: number;
  fecha_orden: Date;
  estado_orden: string;
  monto_total: number;
  descripcion?: string;

  constructor(orden: Orden) {
    this.id_orden = orden.id_orden;
    this.id_usuario = orden.id_usuario;
    this.fecha_orden = orden.fecha_orden;
    this.estado_orden = orden.estado_orden;
    this.monto_total = orden.monto_total;
    this.descripcion = orden.descripcion;
  }
}
