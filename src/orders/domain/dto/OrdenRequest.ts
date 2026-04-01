// En domain/dto/OrdenRequest.ts
export interface OrdenRequest {
  id_usuario: number;
  estado_orden: string;
  monto_total: number;
  descripcion?: string;
  direccion: string;
  metodo_pago: {
    tipo: 'tarjeta' | 'efectivo';
    ultimos4?: string;
  };
  productos: {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface OrdenUpdateRequest {
  estado_orden?: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada' | 'listo_para_recoleccion' | 'en_camino' | 'entregado';
  monto_total?: number;
  descripcion?: string;
  id_repartidor?: number;
}
