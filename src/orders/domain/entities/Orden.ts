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
  fecha_orden: Date;
  estado_orden: string;
  monto_total: number;
  descripcion?: string;
  productos: OrdenItem[]; // <--- Agregamos la lista de productos
}