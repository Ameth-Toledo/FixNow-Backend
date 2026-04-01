// En domain/entities/Orden.ts
export interface OrdenItem {
  id_producto: number;
  nombre?: string; // Opcional, para mostrarlo en el ticket rápido
  cantidad: number;
  precio_unitario: number;
}

export interface Orden {
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
  productos: OrdenItem[];
}