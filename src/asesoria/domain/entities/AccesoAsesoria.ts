export interface AccesoAsesoria {
  tiene_acceso: boolean;
  id_pago: number | null;
  fecha_expiracion: Date | null;
  dias_restantes: number | null;
}
