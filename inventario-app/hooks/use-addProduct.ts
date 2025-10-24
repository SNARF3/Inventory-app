import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useProductos } from './useProducts';

export interface ProductFormData {
  nameproduct: string;
  quantity: string;
  sellprice: string;
  buyprice: string;
  min_stock: string;
  averagequantity: string;
  descriptionproduct: string;
}

export const useAddProduct = () => {
  const { addProducto } = useProductos('marvin', '240505', 20, true);

  const [formData, setFormData] = useState<ProductFormData>({
    nameproduct: '',
    quantity: '',
    sellprice: '',
    buyprice: '',
    min_stock: '',
    averagequantity: '',
    descriptionproduct: '',
  });

  const [loading, setLoading] = useState(false);

  // Usar useCallback para evitar recreaciones innecesarias
  const handleInputChange = useCallback((field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const validateForm = (): boolean => {
    // Validaciones más robustas
    if (!formData.nameproduct.trim()) {
      Alert.alert('Error', 'El nombre del producto es obligatorio');
      return false;
    }

    const quantityNum = Number(formData.quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      Alert.alert('Error', 'La cantidad debe ser un número válido mayor o igual a 0');
      return false;
    }

    const sellpriceNum = Number(formData.sellprice);
    if (isNaN(sellpriceNum) || sellpriceNum < 0) {
      Alert.alert('Error', 'El precio de venta debe ser un número válido mayor o igual a 0');
      return false;
    }

    const buypriceNum = Number(formData.buyprice);
    if (isNaN(buypriceNum) || buypriceNum < 0) {
      Alert.alert('Error', 'El precio de compra debe ser un número válido mayor o igual a 0');
      return false;
    }

    return true;
  };

  const resetForm = useCallback(() => {
    setFormData({
      nameproduct: '',
      quantity: '',
      sellprice: '',
      buyprice: '',
      min_stock: '',
      averagequantity: '',
      descriptionproduct: '',
    });
  }, []);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      // Pequeño delay para evitar problemas de rendimiento
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await addProducto(
        formData.nameproduct.trim(),
        Number(formData.quantity),
        Number(formData.sellprice),
        Number(formData.buyprice),
        formData.min_stock ? Number(formData.min_stock) : 0,
        formData.averagequantity ? Number(formData.averagequantity) : 0,
        formData.descriptionproduct.trim(),
        null,
        "marvin"
      );

      resetForm();
      Alert.alert('Éxito', 'Producto agregado correctamente');
      return true;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      Alert.alert('Error', 'No se pudo agregar el producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, addProducto, resetForm]);

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};