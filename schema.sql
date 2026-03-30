CREATE DATABASE voltio;

USE voltio;

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
    role ENUM('user', 'technician', 'admin') NOT NULL DEFAULT 'user',
    account_type ENUM('person', 'company') NOT NULL DEFAULT 'person',
    company_name VARCHAR(150) DEFAULT NULL,
    company_tax_id VARCHAR(50) DEFAULT NULL,
    company_address VARCHAR(255) DEFAULT NULL,
    firebase_token VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Si la tabla users ya existe en tu base actual, aplica manualmente:
-- ALTER TABLE users MODIFY role ENUM('user', 'technician', 'admin') NOT NULL DEFAULT 'user';
-- ALTER TABLE users ADD COLUMN account_type ENUM('person', 'company') NOT NULL DEFAULT 'person' AFTER role;
-- ALTER TABLE users ADD COLUMN company_name VARCHAR(150) DEFAULT NULL AFTER account_type;
-- ALTER TABLE users ADD COLUMN company_tax_id VARCHAR(50) DEFAULT NULL AFTER company_name;
-- ALTER TABLE users ADD COLUMN company_address VARCHAR(255) DEFAULT NULL AFTER company_tax_id;
-- ALTER TABLE users ADD COLUMN firebase_token VARCHAR(255) DEFAULT NULL AFTER company_address;

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);

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

CREATE TABLE especificaciones (
    id_especificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    clave VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE ordenes (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_orden ENUM('pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada') DEFAULT 'pendiente',
    monto_total DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(255) NOT NULL,
    metodo_pago_tipo ENUM('tarjeta', 'efectivo') NOT NULL,
    metodo_pago_ultimos4 VARCHAR(4) DEFAULT NULL,
    CONSTRAINT fk_usuario_orden FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE
);

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

CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    alias VARCHAR(50),
    direccion VARCHAR(255) NOT NULL,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- igual que users
    CONSTRAINT fk_usuario_address FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE  -- nombre explícito + CASCADE
);