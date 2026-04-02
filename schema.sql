CREATE DATABASE IF NOT EXISTS voltio;

USE voltio;

-- 1. Tabla principal de Identidad y Acceso
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    secondname VARCHAR(100) DEFAULT NULL,
    lastname VARCHAR(100) NOT NULL,
    secondlastname VARCHAR(100) DEFAULT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    image_profile VARCHAR(255) DEFAULT NULL,
    role ENUM('user', 'admin', 'repartidor') NOT NULL DEFAULT 'user',
    account_type ENUM('person', 'company') NOT NULL DEFAULT 'person',
    firebase_token VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla exclusiva para perfiles de Locales/Empresas
CREATE TABLE empresas (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE, 
    nombre_comercial VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(20) NOT NULL,
    correo_contacto VARCHAR(255) NOT NULL, 
    logo_url VARCHAR(255) DEFAULT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabla de Direcciones del usuario (tanto personas como empresas pueden tener varias)
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    alias VARCHAR(50),
    direccion VARCHAR(255) NOT NULL,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_address FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tabla de Categorías de Productos
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);

-- 5. Tabla de Productos
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_venta DECIMAL(10, 2) NOT NULL,
    stock_actual INT DEFAULT 0,
    imagen_url TEXT,
    id_categoria INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL
);

-- 6. Especificaciones técnicas de los productos
CREATE TABLE especificaciones (
    id_especificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    clave VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- 7. Tabla de Órdenes (Pedidos)
CREATE TABLE ordenes (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_orden ENUM('pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada', 'listo_para_recoleccion', 'en_camino', 'entregado') DEFAULT 'pendiente',
    monto_total DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8) DEFAULT NULL,
    longitud DECIMAL(11, 8) DEFAULT NULL,
    metodo_pago_tipo ENUM('tarjeta', 'efectivo') NOT NULL,
    metodo_pago_ultimos4 VARCHAR(4) DEFAULT NULL,
    id_repartidor INT DEFAULT NULL,
    CONSTRAINT fk_usuario_orden FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_repartidor_orden FOREIGN KEY (id_repartidor) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Detalles de cada Orden (Carrito de compras guardado)
CREATE TABLE orden_detalles (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_orden INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_orden_detalle FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden) ON DELETE CASCADE,
    CONSTRAINT fk_producto_detalle FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- 9. Tabla de información adicional de Repartidores
CREATE TABLE repartidores_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    vehiculo ENUM('moto', 'auto', 'bici') NOT NULL DEFAULT 'moto',
    placas VARCHAR(20) DEFAULT NULL,
    esta_activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_repartidor_usuario FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE
);