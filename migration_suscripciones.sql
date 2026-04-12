-- ============================================================
-- MIGRACIÓN: Sistema de suscripciones por mensualidad
-- Ejecutar en orden
-- ============================================================

CREATE TABLE IF NOT EXISTS planes (
  id_plan           INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(50)  NOT NULL,              -- 'basico' | 'vendedor' | 'pro' | 'repartidor'
  tipo_rol          ENUM('empresa', 'repartidor') NOT NULL,
  precio            DECIMAL(10, 2) NOT NULL,
  descripcion       TEXT,
  limite_productos  INT DEFAULT NULL,                   -- NULL = ilimitado (plan Pro)
  paypal_plan_id    VARCHAR(100) DEFAULT NULL,          -- Se rellena con POST /api/admin/suscripciones/setup-planes
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suscripciones (
  id_suscripcion         INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario             INT NOT NULL,
  id_plan                INT NOT NULL,
  paypal_subscription_id VARCHAR(100) DEFAULT NULL,
  estado                 ENUM('pendiente', 'activa', 'gracia', 'vencida', 'cancelada') NOT NULL DEFAULT 'pendiente',
  fecha_inicio           DATETIME DEFAULT NULL,
  fecha_vencimiento      DATETIME DEFAULT NULL,         -- fecha_inicio + 30 días
  fecha_fin_gracia       DATETIME DEFAULT NULL,         -- fecha_vencimiento + 5 días
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_plan)    REFERENCES planes(id_plan) ON DELETE RESTRICT
);

-- Índices útiles para las consultas frecuentes
CREATE INDEX idx_suscripciones_usuario  ON suscripciones (id_usuario);
CREATE INDEX idx_suscripciones_paypal   ON suscripciones (paypal_subscription_id);
CREATE INDEX idx_suscripciones_estado   ON suscripciones (estado);
CREATE INDEX idx_suscripciones_vence    ON suscripciones (fecha_vencimiento);

-- ============================================================
-- SEED: Planes por defecto
-- Después de ejecutar esto, crear los planes en el dashboard de
-- PayPal y actualizar la columna paypal_plan_id con los IDs.
-- ============================================================

INSERT INTO planes (nombre, tipo_rol, precio, descripcion, limite_productos) VALUES
  ('basico',
   'empresa',
   99.00,
   'Para vendedores que están comenzando en línea. Hasta 50 productos publicados, panel de vendedor, estadísticas básicas y soporte por correo.',
   50),

  ('vendedor',
   'empresa',
   199.00,
   'Para tiendas en crecimiento que necesitan más alcance. Todo lo del plan Básico, hasta 100 productos publicados, estadísticas avanzadas, posicionamiento destacado y soporte prioritario.',
   100),

  ('pro',
   'empresa',
   499.00,
   'Para tiendas grandes que necesitan potencia y control total. Todo lo del plan Vendedor, productos ilimitados, analytics avanzado, posicionamiento prioritario y soporte prioritario 24/7.',
   NULL),  -- ilimitado

  ('repartidor',
   'repartidor',
   189.00,
   'Plan único para repartidores. Acceso a pedidos disponibles en la plataforma.',
   NULL);  -- no aplica
