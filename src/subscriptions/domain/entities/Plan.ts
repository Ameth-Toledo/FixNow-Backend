export interface Plan {
  id_plan: number;
  nombre: string;
  tipo_rol: 'empresa' | 'repartidor';
  precio: number;
  descripcion: string | null;
  limite_productos: number | null;  // null = ilimitado
  paypal_plan_id: string | null;
  activo: boolean;
}
