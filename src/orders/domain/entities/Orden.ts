// En domain/entities/Orden.ts
export interface OrdenItem {
  id_producto: number;
  nombre?: string;
  imagen_url?: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Orden {
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
  productos: OrdenItem[];
}