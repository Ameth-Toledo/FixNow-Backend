// En domain/dto/OrdenRequest.ts
export interface OrdenRequest {
  id_usuario: number;
  estado_orden: string;
  monto_total: number;
  descripcion?: string;
  productos: {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
  }[]; // <--- Obligatorio para crear la orden
}

export interface OrdenUpdateRequest {
  estado_orden?: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  monto_total?: number;
  descripcion?: string;
}
