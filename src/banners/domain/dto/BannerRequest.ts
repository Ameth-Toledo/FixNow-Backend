export interface BannerRequest {
  id_empresa:   number;
  nombre:       string;
  imagen_url?:  string;
  activo?:      boolean;
  fecha_inicio: string;
  fecha_fin:    string;
}
