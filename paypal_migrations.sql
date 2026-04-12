-- ============================================================
-- MIGRACIÓN: Sistema de Asesoría Personalizada + Wallet
-- Ejecutar en orden
-- ============================================================

-- 1. Agregar columnas de asesoría a la tabla empresas
ALTER TABLE empresas
  ADD COLUMN precio_asesoria  DECIMAL(10, 2) DEFAULT NULL,
  ADD COLUMN asesoria_activa  BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Registro de cada pago de asesoría realizado por un usuario
CREATE TABLE IF NOT EXISTS pagos_asesoria (
  id_pago             INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario          INT NOT NULL,
  id_empresa          INT NOT NULL,
  id_conversacion     INT DEFAULT NULL,
  paypal_order_id     VARCHAR(100) NOT NULL,
  monto_total         DECIMAL(10, 2) NOT NULL,   -- lo que pagó el usuario
  monto_empresa       DECIMAL(10, 2) NOT NULL,   -- 80%
  monto_app           DECIMAL(10, 2) NOT NULL,   -- 20%
  estado              ENUM('pendiente', 'completado', 'reembolsado') NOT NULL DEFAULT 'pendiente',
  fecha_expiracion    DATETIME DEFAULT NULL,      -- created_at + 7 días (se llena al confirmar)
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario)      REFERENCES users(id)             ON DELETE CASCADE,
  FOREIGN KEY (id_empresa)      REFERENCES empresas(id_empresa)  ON DELETE CASCADE,
  FOREIGN KEY (id_conversacion) REFERENCES conversaciones(id_conversacion) ON DELETE SET NULL
);

-- 3. Wallet virtual de cada empresa
CREATE TABLE IF NOT EXISTS wallet_empresas (
  id_wallet           INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa          INT NOT NULL UNIQUE,
  saldo_disponible    DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- puede retirar
  saldo_retenido      DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- retiros en proceso
  total_ganado        DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- histórico acumulado
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

-- 4. Solicitudes de retiro de las empresas
CREATE TABLE IF NOT EXISTS retiros (
  id_retiro           INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa          INT NOT NULL,
  monto               DECIMAL(10, 2) NOT NULL,
  metodo              ENUM('transferencia', 'paypal') NOT NULL,
  datos_cuenta        JSON NOT NULL,              -- { "titular": "", "clabe": "", "email": "" }
  estado              ENUM('pendiente', 'procesado', 'rechazado') NOT NULL DEFAULT 'pendiente',
  notas_admin         TEXT DEFAULT NULL,          -- motivo de rechazo u observaciones
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  procesado_at        DATETIME DEFAULT NULL,
  FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

-- 5. Índices útiles
CREATE INDEX idx_pagos_asesoria_usuario    ON pagos_asesoria (id_usuario);
CREATE INDEX idx_pagos_asesoria_empresa    ON pagos_asesoria (id_empresa);
CREATE INDEX idx_pagos_asesoria_estado     ON pagos_asesoria (estado);
CREATE INDEX idx_pagos_asesoria_expiracion ON pagos_asesoria (fecha_expiracion);
CREATE INDEX idx_retiros_empresa           ON retiros (id_empresa);
CREATE INDEX idx_retiros_estado            ON retiros (estado);

-- 6. Inicializar wallet para empresas que ya existen
INSERT INTO wallet_empresas (id_empresa, saldo_disponible, saldo_retenido, total_ganado)
SELECT id_empresa, 0.00, 0.00, 0.00
FROM empresas
ON DUPLICATE KEY UPDATE id_empresa = id_empresa;
