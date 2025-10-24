const dbModel= `
CREATE TABLE categoria (
    id_categoria integer NOT NULL CONSTRAINT categoria_pk PRIMARY KEY,
    nombre varchar(30) NOT NULL
);

CREATE TABLE historial_precios (
    id_hist integer NOT NULL CONSTRAINT historial_precios_pk PRIMARY KEY,
    id_producto integer NOT NULL,
    fecha date NOT NULL,
    precio_venta decimal(10,2) NOT NULL,
    precio_dolar decimal(10,2) NOT NULL,
    CONSTRAINT priceshistorial_products FOREIGN KEY (id_producto)
    REFERENCES products (id_producto)
);

CREATE TABLE lote (
    id_lote integer NOT NULL CONSTRAINT lote_pk PRIMARY KEY,
    detalle_lote text NOT NULL,
    fecha_registro date NOT NULL,
    fecha_fin_lote date NOT NULL
);

CREATE TABLE lote_producto (
    id_lote_producto integer NOT NULL CONSTRAINT lote_producto_pk PRIMARY KEY,
    id_lote integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad numeric NOT NULL,
    precio_compra decimal(10,2) NOT NULL,
    precio_dolar decimal(10,2) NOT NULL,
    CONSTRAINT lote_producto_lote FOREIGN KEY (id_lote)
    REFERENCES lote (id_lote),
    CONSTRAINT lote_producto_products FOREIGN KEY (id_producto)
    REFERENCES products (id_producto)
);

CREATE TABLE IF NOT EXISTS productos (
    id_producto integer NOT NULL CONSTRAINT products_pk PRIMARY KEY AUTOINCREMENT,
    nombre text NOT NULL,
    cantidad decimal(10,2) NOT NULL,
    min_stock decimal(10,2) NOT NULL,
    cantidad_promedio decimal(10,2) NOT NULL,
    descripcion text NOT NULL,
    imagen blob,
    id_categoria integer NOT NULL,
    precio_venta decimal(10,2) NOT NULL,
    CONSTRAINT products_categoria FOREIGN KEY (id_categoria)
    REFERENCES categoria (id_categoria)
);

CREATE TABLE IF NOT EXISTS usuario_lote (
    id_user integer NOT NULL CONSTRAINT user_products_pk PRIMARY KEY,
    id_lote integer NOT NULL,
    CONSTRAINT FK_1 FOREIGN KEY (id_user)
    REFERENCES users (id_user)
    ON DELETE CASCADE,
    CONSTRAINT user_products_lote FOREIGN KEY (id_lote)
    REFERENCES lote (id_lote)
);

CREATE TABLE IF NOT EXISTS usuario (
    id_user integer NOT NULL CONSTRAINT users_pk PRIMARY KEY AUTOINCREMENT,
    correo varchar(100) NOT NULL,
    contrasenia varchar(16) NOT NULL,
    nombre varchar(100) NOT NULL,
    apellido varchar(100) NOT NULL,
    telefono integer NOT NULL
);

CREATE TABLE venta (
    id_venta integer NOT NULL CONSTRAINT venta_pk PRIMARY KEY,
    fecha date NOT NULL,
    id_producto integer NOT NULL,
    id_lote_producto integer NOT NULL,
    cantidad numeric NOT NULL,
    precio_venta decimal(10,2) NOT NULL,
    id_hist integer NOT NULL,
    CONSTRAINT venta_products FOREIGN KEY (id_producto)
    REFERENCES products (id_producto),
    CONSTRAINT venta_lote_producto FOREIGN KEY (id_lote_producto)
    REFERENCES lote_producto (id_lote_producto),
    CONSTRAINT venta_priceshistorial FOREIGN KEY (id_hist)
    REFERENCES historial_precios (id_hist)
);
`;
export default dbModel;