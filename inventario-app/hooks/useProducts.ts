import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/data_base';

export type Producto = {
  id_product: number;
  nameproduct: string;
  quantity: number;
  sellprice: number;
  buyprice: number;
  min_stock: number;
  averagequantity: number;
  descriptionproduct: string;
  imageproduct: Uint8Array | null;
  username: string;
};

export type Usuario = {
  id_user: number;
  username: string;
  pin: string;
};

// ========================
// Función para obtener productos con paginación
// ========================
function getProductosConLimite(offset: number, limit: number): Producto[] {
  const sql = 'SELECT * FROM products ORDER BY id_product DESC LIMIT ? OFFSET ?;';
  return db.getAllSync(sql, [limit, offset]);
}

// ========================
// Hook de paginación de productos
// ========================
export function useInfiniteProductos(itemsPorCarga = 20, dbReady = false) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cargarProductos = useCallback(async (reset = false) => {
    if (!dbReady) return;

    const currentOffset = reset ? 0 : offset;
    const nuevosProductos = getProductosConLimite(currentOffset, itemsPorCarga);
    
    if (reset) {
      setProductos(nuevosProductos);
      setOffset(nuevosProductos.length);
    } else {
      setProductos(prev => [...prev, ...nuevosProductos]);
      setOffset(prev => prev + nuevosProductos.length);
    }

    if (nuevosProductos.length < itemsPorCarga) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [dbReady, offset, itemsPorCarga]);

  const cargarMas = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await cargarProductos(false);
    setLoading(false);
  }, [loading, hasMore, cargarProductos]);

  const refreshProductos = useCallback(async () => {
    setRefreshing(true);
    await cargarProductos(true);
    setRefreshing(false);
  }, [cargarProductos]);

  useEffect(() => {
    if (dbReady) {
      cargarProductos(true);
    }
  }, [dbReady]);

  return { 
    productos, 
    cargarMas, 
    hasMore, 
    loading, 
    refreshing,
    refreshProductos,
    setProductos // Para actualizaciones después de CRUD
  };
}

// ========================
// Hook principal con CRUD mejorado
// ========================
export function useProductos(
  username: string = 'marvin', 
  pin: string = '240505',      
  itemsPorCarga = 20,
  dbReady = false
) {
  const { 
    productos, 
    cargarMas, 
    hasMore, 
    loading, 
    refreshing,
    refreshProductos,
    setProductos 
  } = useInfiniteProductos(itemsPorCarga, dbReady);

  // ========================
  // CRUD de productos mejorado
  // ========================
  const addProducto = useCallback((
    nameproduct: string,
    quantity: number,
    sellprice: number,
    buyprice: number,
    min_stock: number,
    averagequantity: number,
    descriptionproduct: string,
    imageproduct: string | null,
    username: string
  ) => {
    const sql = `
      INSERT INTO products 
        (nameproduct, quantity, sellprice, buyprice, min_stock, averagequantity, descriptionproduct, imageproduct, username)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  
    const params = [
      nameproduct,
      quantity,
      sellprice,
      buyprice,
      min_stock,
      averagequantity,
      descriptionproduct,
      imageproduct || null,
      username,
    ];
  
    db.runSync(sql, params);
    // Refrescar la lista después de agregar
    refreshProductos();
  }, [refreshProductos]);

  const deleteProducto = useCallback((id_product: number) => {
    const sql = `DELETE FROM products WHERE id_product = ?;`;
    db.runSync(sql, [id_product]);
    // Actualizar lista localmente
    setProductos(prev => prev.filter(p => p.id_product !== id_product));
  }, [setProductos]);

  const updateProducto = useCallback((producto: Producto) => {
    const sql = `
      UPDATE products 
      SET nameproduct = ?, quantity = ?, sellprice = ?, buyprice = ?, 
          min_stock = ?, averagequantity = ?, descriptionproduct = ?, 
          imageproduct = ?, username = ?
      WHERE id_product = ?;
    `;
    
    const params = [
      producto.nameproduct,
      producto.quantity,
      producto.sellprice,
      producto.buyprice,
      producto.min_stock,
      producto.averagequantity,
      producto.descriptionproduct,
      producto.imageproduct,
      producto.username,
      producto.id_product
    ];
    
    db.runSync(sql, params);
    refreshProductos();
  }, [refreshProductos]);

  // ========================
  // Funciones de usuarios
  // ========================
  const addUsuario = (newUsername: string, newPin: string) => {
    const sql = `INSERT INTO users (username, pin) VALUES (?, ?);`;
    db.runSync(sql, [newUsername, newPin]);
  };

  const getUsuarios = (): Usuario[] => {
    const sql = `SELECT * FROM users;`;
    return db.getAllSync(sql);
  };

  const validarUsuario = (checkUsername: string, checkPin: string) => {
    const sql = `SELECT * FROM users WHERE username = ? AND pin = ?;`;
    return db.getAllSync(sql, [checkUsername, checkPin]).length > 0;
  };

  const eliminarUsuario = (id_user: number) => {
    const sql = `DELETE FROM users WHERE id_user = ?;`;
    db.runSync(sql, [id_user]);
  };

  return {
    productos,
    cargarMas,
    hasMore,
    loading,
    refreshing,
    refreshProductos,
    addProducto,
    deleteProducto,
    updateProducto,
    addUsuario,
    getUsuarios,
    validarUsuario,
    eliminarUsuario,
  };
}