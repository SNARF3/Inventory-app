import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { db } from '../db/data_base';

// Interfaces para los tipos de datos
export interface LoteFormData {
  detalle_lote: string;
  fecha_fin: string; // YYYY-MM-DD
}

export interface ProductoLoteFormData {
  id_producto: string;
  cantidad: string;
  precio_compra: string;
  precio_dolar: string;
}

export interface LoteCompleto {
  lote: LoteFormData;
  productos: ProductoLoteFormData[];
}

export interface DolarData {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number | null;
  venta: number;
  fechaActualizacion: string;
}

export const useAddLote = () => {
  // Estados para el proceso de dos pasos
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loteData, setLoteData] = useState<LoteFormData>({
    detalle_lote: '',
    fecha_fin: '',
  });
  const [productosData, setProductosData] = useState<ProductoLoteFormData[]>([]);
  const [currentProducto, setCurrentProducto] = useState<ProductoLoteFormData>({
    id_producto: '',
    cantidad: '',
    precio_compra: '',
    precio_dolar: '',
  });
  const [loading, setLoading] = useState(false);
  const [dolarPrice, setDolarPrice] = useState<number | null>(null);

  // Obtener ID del usuario desde AsyncStorage
  const getUserId = async (): Promise<number> => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) {
        throw new Error('Usuario no autenticado');
      }
      
      const userData = JSON.parse(session);
      return userData.userId;
    } catch (error) {
      console.error('Error obteniendo ID de usuario:', error);
      throw new Error('No se pudo obtener la información del usuario');
    }
  };

  // Obtener precio del dólar desde la API
  const fetchDolarPrice = useCallback(async (): Promise<number> => {
    try {
      console.log('💰 Obteniendo precio del dólar...');
      const response = await fetch('https://bo.dolarapi.com/v1/dolares/binance');
      
      if (!response.ok) {
        throw new Error('Error al obtener el precio del dólar');
      }
      
      const dolarData: DolarData = await response.json();
      console.log('✅ Precio del dólar obtenido:', dolarData.venta);
      
      setDolarPrice(dolarData.venta);
      return dolarData.venta;
    } catch (error) {
      console.error('❌ Error obteniendo precio del dólar:', error);
      throw new Error('No se pudo obtener el precio del dólar');
    }
  }, []);

  // Paso 1: Crear el lote básico
  const crearLote = async (): Promise<number> => {
    try {
      const userId = await getUserId();
      const fechaRegistro = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Obtener el próximo ID del lote
      const nextIdResult = db.getAllSync(
        'SELECT COALESCE(MAX(id_lote), 0) + 1 as next_id FROM lote;'
      ) as { next_id: number }[];
      
      const loteId = nextIdResult[0]?.next_id || 1;

      const sql = `
        INSERT INTO lote (id_lote, detalle_lote, fecha_registro, fecha_fin_lote)
        VALUES (?, ?, ?, ?);
      `;
      
      const params = [
        loteId, 
        loteData.detalle_lote || '', // Usar detalle_lote, vacío si no se proporciona
        fechaRegistro, 
        loteData.fecha_fin
      ];
      
      db.runSync(sql, params);
      console.log('✅ Lote creado con ID:', loteId, 'Detalle:', loteData.detalle_lote);

      // Relacionar usuario con lote
      const userLoteSql = `
        INSERT OR REPLACE INTO usuario_productos (id_user, id_lote)
        VALUES (?, ?);
      `;
      
      db.runSync(userLoteSql, [userId, loteId]);
      console.log('✅ Relación usuario-lote creada');

      return loteId;
    } catch (error) {
      console.error('Error creando lote:', error);
      throw new Error('No se pudo crear el lote');
    }
  };

  // Paso 2: Agregar producto al lote
  const agregarProductoAlLote = async (loteId: number, producto: ProductoLoteFormData): Promise<void> => {
    try {
      // Obtener precio del dólar si no está disponible
      let precioDolar = dolarPrice;
      if (!precioDolar) {
        precioDolar = await fetchDolarPrice();
      }

      // Obtener el próximo ID del lote_producto
      const nextIdResult = db.getAllSync(
        'SELECT COALESCE(MAX(id_lote_producto), 0) + 1 as next_id FROM lote_producto;'
      ) as { next_id: number }[];
      
      const loteProductoId = nextIdResult[0]?.next_id || 1;

      const sql = `
        INSERT INTO lote_producto (id_lote_producto, id_lote, id_producto, cantidad, precio_compra, precio_dolar)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      
      const params = [
        loteProductoId,
        loteId,
        parseInt(producto.id_producto),
        parseFloat(producto.cantidad),
        parseFloat(producto.precio_compra),
        precioDolar
      ];
      
      db.runSync(sql, params);
      console.log('✅ Producto agregado al lote:', producto.id_producto);
    } catch (error) {
      console.error('Error agregando producto al lote:', error);
      throw new Error('No se pudo agregar el producto al lote');
    }
  };

  // Manejo del formulario del lote (Paso 1)
  const handleLoteInputChange = (field: keyof LoteFormData, value: string) => {
    setLoteData(prev => ({ ...prev, [field]: value }));
  };

  // Manejo del formulario de productos (Paso 2)
  const handleProductoInputChange = (field: keyof ProductoLoteFormData, value: string) => {
    setCurrentProducto(prev => ({ ...prev, [field]: value }));
  };

  // Agregar producto a la lista (Paso 2)
  const agregarProductoALista = () => {
    if (!currentProducto.id_producto || !currentProducto.cantidad || !currentProducto.precio_compra) {
      Alert.alert('Error', 'Completa todos los campos del producto');
      return;
    }

    // Usar precio del dólar actual o valor ingresado
    const productoConDolar = {
      ...currentProducto,
      precio_dolar: dolarPrice ? dolarPrice.toString() : currentProducto.precio_dolar
    };

    setProductosData(prev => [...prev, productoConDolar]);
    setCurrentProducto({
      id_producto: '',
      cantidad: '',
      precio_compra: '',
      precio_dolar: dolarPrice ? dolarPrice.toString() : '',
    });
    
    console.log('📦 Producto agregado a la lista:', productoConDolar);
  };

  // Remover producto de la lista
  const removerProductoDeLista = (index: number) => {
    setProductosData(prev => prev.filter((_, i) => i !== index));
  };

  // Validación del paso 1 (Lote básico)
  const isLoteValid = loteData.fecha_fin.trim() !== '';

  // Validación del paso 2 (Productos)
  const isProductoValid = 
    currentProducto.id_producto.trim() !== '' &&
    currentProducto.cantidad.trim() !== '' &&
    currentProducto.precio_compra.trim() !== '';

  const hasProductos = productosData.length > 0;

  // Proceso completo de guardado
  const guardarLoteCompleto = async (): Promise<boolean> => {
    if (!isLoteValid || !hasProductos) {
      Alert.alert('Error', 'Completa todos los campos y agrega al menos un producto');
      return false;
    }

    setLoading(true);

    try {
      console.log('🔄 Guardando lote completo...');

      // 1. Obtener precio del dólar
      await fetchDolarPrice();

      // 2. Crear el lote básico
      const loteId = await crearLote();
      
      // 3. Agregar todos los productos al lote
      for (const producto of productosData) {
        await agregarProductoAlLote(loteId, producto);
      }

      console.log('✅ Lote guardado exitosamente con', productosData.length, 'productos');
      Alert.alert('Éxito', 'Lote guardado correctamente');
      
      // Resetear el formulario
      setLoteData({ 
        detalle_lote: '', 
        fecha_fin: '' 
      });
      setProductosData([]);
      setCurrentStep(1);
      
      return true;
    } catch (error) {
      console.error('❌ Error guardando lote completo:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo guardar el lote');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Navegar al siguiente paso
  const irAlSiguientePaso = async () => {
    if (!isLoteValid) {
      Alert.alert('Error', 'Completa la fecha de fin del lote');
      return;
    }

    // Obtener precio del dólar antes de continuar
    try {
      await fetchDolarPrice();
      setCurrentStep(2);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el precio del dólar');
    }
  };

  // Volver al paso anterior
  const irAlPasoAnterior = () => {
    setCurrentStep(1);
  };

  // Cargar productos disponibles para seleccionar
  const obtenerProductosDisponibles = () => {
    try {
      const productos = db.getAllSync(`
        SELECT id_producto, nombre, precio_venta 
        FROM productos 
        ORDER BY nombre;
      `) as { id_producto: number; nombre: string; precio_venta: number }[];
      
      return productos;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  };

  return {
    // Estados
    currentStep,
    loteData,
    productosData,
    currentProducto,
    loading,
    dolarPrice,
    
    // Funciones del lote (Paso 1)
    handleLoteInputChange,
    isLoteValid,
    
    // Funciones de productos (Paso 2)
    handleProductoInputChange,
    agregarProductoALista,
    removerProductoDeLista,
    isProductoValid,
    hasProductos,
    
    // Funciones de navegación
    irAlSiguientePaso,
    irAlPasoAnterior,
    
    // Función principal
    guardarLoteCompleto,
    
    // Utilidades
    obtenerProductosDisponibles,
    fetchDolarPrice,
  };
};