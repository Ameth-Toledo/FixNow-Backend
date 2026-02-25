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
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Tabla de Productos (Electrónica + Cloudinary)
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