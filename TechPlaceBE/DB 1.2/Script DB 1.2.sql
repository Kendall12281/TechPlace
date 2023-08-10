
DROP DATABASE IF EXISTS `techplace`;

CREATE SCHEMA `techplace` ;

USE techplace; 

CREATE TABLE Roles (
  rol_id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol VARCHAR(255)
);

CREATE TABLE Usuarios (
  usuario_id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_completo VARCHAR(255),
  identificacion VARCHAR(255),
  numero_telefono VARCHAR(255),
  correo_electronico VARCHAR(255),
  contrasena VARCHAR(255),
  rol_id INT,
  desactivado TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (rol_id) REFERENCES Roles(rol_id)
);


CREATE TABLE Direcciones (
  direccion_id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  provincia VARCHAR(255),
  provinciaid INT,
  canton VARCHAR(255),
  cantonid INT,
  distrito VARCHAR(255),
  distritoid INT,
  direccion_exacta VARCHAR(255),
  codigo_postal VARCHAR(255),
  telefono VARCHAR(255),
  eliminado TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE MetodosPago (
  metodo_pago_id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tipo_pago VARCHAR(255),
  proveedor VARCHAR(255),
  numero_cuenta VARCHAR(255),
  fecha_expiracion VARCHAR(255),
  eliminado TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE Categorias (
  categoria_id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_categoria VARCHAR(255)
);

CREATE TABLE Productos (
  producto_id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  nombre VARCHAR(255),
  descripcion VARCHAR(255),
  precio DECIMAL(10, 2),
  cantidad INT,
  categoria_id INT,
  estado VARCHAR(255),
  activado INT DEFAULT 1,
  FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE PreguntasProducto (
  preguntas_producto_id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT,
  usuario_id INT,
  comentario_usuario VARCHAR(255),
  respuesta_vendedor VARCHAR(255),
  fecha_pregunta DATE DEFAULT (CURDATE()),
  FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE FotosProducto (
  foto_id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT,
  foto_Base64 LONGTEXT ,
  FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);


CREATE TABLE EstadoPedido (
  estado_pedido_id INT PRIMARY KEY AUTO_INCREMENT,
  nombre_estado VARCHAR(255)
);


CREATE TABLE Compras (
  compra_id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  direccion_id INT,
  metodo_pago_id INT,
  estado_pedido_id INT,
  fecha_compra DATE DEFAULT (CURDATE()),
  hora_compra TIME DEFAULT (CURTIME()),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
  FOREIGN KEY (direccion_id) REFERENCES Direcciones(direccion_id),
  FOREIGN KEY (metodo_pago_id) REFERENCES MetodosPago(metodo_pago_id),
  FOREIGN KEY (estado_pedido_id) REFERENCES EstadoPedido(estado_pedido_id)
);


CREATE TABLE DetallesCompra (
  detalle_compra_id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  compra_id INT,
  producto_id INT,
  cantidad INT,
  subtotal DECIMAL(10, 2),
  impuesto DECIMAL(10, 2),
  total DECIMAL(10, 2),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
  FOREIGN KEY (compra_id) REFERENCES Compras(compra_id),
  FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);

CREATE TABLE Evaluaciones (
  evaluacion_id INT PRIMARY KEY AUTO_INCREMENT,
  compra_id INT,
  vendedor_id INT,
  cliente_id INT,
  calificacion_cliente INT,
  fecha_evaluacion DATE DEFAULT (CURDATE()),
  comentario_cliente VARCHAR(255),
  calificacion_vendedor INT,
  comentario_vendedor VARCHAR(255),
  FOREIGN KEY (compra_id) REFERENCES Compras(compra_id),
  FOREIGN KEY (vendedor_id) REFERENCES Usuarios(usuario_id),
  FOREIGN KEY (cliente_id) REFERENCES Usuarios(usuario_id)
);