export interface Empresa {
  id_empresa:         number;
  id_usuario:         number;
  nombre_comercial:   string;
  direccion:          string;
  telefono_contacto:  string;
  correo_contacto:    string;
  logo_url:           string | null;
  fecha_registro:     Date;
  precio_asesoria:    number | null;
  asesoria_activa:    boolean;
}
