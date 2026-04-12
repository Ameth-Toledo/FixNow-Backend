-- Migración: crear tabla banners
-- Ejecutar una sola vez en la base de datos

CREATE TABLE IF NOT EXISTS banners (
  id_banner    INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa   INT          NOT NULL,
  nombre       VARCHAR(255) NOT NULL,
  imagen_url   TEXT         NULL,
  activo       TINYINT(1)   NOT NULL DEFAULT 1,
  fecha_inicio DATE         NOT NULL,
  fecha_fin    DATE         NOT NULL,
  clicks       INT          NOT NULL DEFAULT 0,
  vistas       INT          NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_banner_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresas (id_empresa) ON DELETE CASCADE
);
