import { Empresa } from '../entities/Empresa';

export class EmpresaResponse {
  id_empresa:        number;
  id_usuario:        number;
  nombre_comercial:  string;
  direccion:         string;
  telefono_contacto: string;
  correo_contacto:   string;
  logo_url:          string | null;
  fecha_registro:    Date;
  precio_asesoria:   number | null;
  asesoria_activa:   boolean;

  constructor(empresa: Empresa) {
    this.id_empresa        = empresa.id_empresa;
    this.id_usuario        = empresa.id_usuario;
    this.nombre_comercial  = empresa.nombre_comercial;
    this.direccion         = empresa.direccion;
    this.telefono_contacto = empresa.telefono_contacto;
    this.correo_contacto   = empresa.correo_contacto;
    this.logo_url          = empresa.logo_url;
    this.fecha_registro    = empresa.fecha_registro;
    this.precio_asesoria   = empresa.precio_asesoria;
    this.asesoria_activa   = empresa.asesoria_activa;
  }
}
