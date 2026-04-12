export interface Banner {
  id_banner:    number;
  id_empresa:   number;
  nombre:       string;
  imagen_url:   string | null;
  activo:       boolean;
  fecha_inicio: string;
  fecha_fin:    string;
  clicks:       number;
  vistas:       number;
  created_at?:  Date;
}
