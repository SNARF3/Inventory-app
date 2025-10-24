import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ButtonPrimary } from '../../../../../components/common/ButtonPrimary';
import { HeaderText } from '../../../../../components/common/HeaderText';
import { InputField } from '../../../../../components/common/InputField';
import { Colors, Spacing, Typography } from '../../../../../constants/theme';
import { useAddLote } from '../../../../../hooks/use-addLote';

export default function AddLoteProductoScreen() {
  const {
    productosData,
    currentProducto,
    loading,
    dolarPrice,
    handleProductoInputChange,
    agregarProductoALista,
    removerProductoDeLista,
    isProductoValid,
    hasProductos,
    guardarLoteCompleto,
    irAlPasoAnterior,
    obtenerProductosDisponibles,
  } = useAddLote();

  const [dolarEditable, setDolarEditable] = useState(false);
  const productosDisponibles = obtenerProductosDisponibles();

  const handleAgregarProducto = () => {
    if (!isProductoValid) {
      Alert.alert('Error', 'Completa todos los campos del producto');
      return;
    }
    agregarProductoALista();
  };

  const handleGuardarLote = async () => {
    const success = await guardarLoteCompleto();
    if (success) {
      router.replace('/views/(tabs)/inventory/lotes/ListLotes');
    }
  };

  const getProductoNombre = (idProducto: string) => {
    const producto = productosDisponibles.find(p => p.id_producto.toString() === idProducto);
    return producto ? producto.nombre : 'Producto no encontrado';
  };

  const renderProductoItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.productoItem}>
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>
          {getProductoNombre(item.id_producto)}
        </Text>
        <Text style={styles.productoDetalles}>
          Cantidad: {item.cantidad} • Precio: Bs. {parseFloat(item.precio_compra).toFixed(2)}
        </Text>
        <Text style={styles.productoDolar}>
          Dólar: Bs. {parseFloat(item.precio_dolar).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removerProductoDeLista(index)}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={irAlPasoAnterior}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primarySolid} />
          </TouchableOpacity>
          <HeaderText variant="h1">Agregar Productos</HeaderText>
          <Text style={styles.subtitle}>
            Paso 2: Productos del lote
          </Text>
        </View>

        {/* Información del dólar */}
        <View style={styles.dolarSection}>
          <View style={styles.dolarHeader}>
            <Text style={styles.dolarTitle}>Precio del Dólar</Text>
            <TouchableOpacity 
              style={styles.editToggle}
              onPress={() => setDolarEditable(!dolarEditable)}
            >
              <Ionicons 
                name={dolarEditable ? "lock-open" : "lock-closed"} 
                size={20} 
                color={Colors.primarySolid} 
              />
              <Text style={styles.editToggleText}>
                {dolarEditable ? 'Editable' : 'Bloqueado'}
              </Text>
            </TouchableOpacity>
          </View>
          <InputField
            placeholder="Precio del dólar"
            value={currentProducto.precio_dolar || (dolarPrice ? dolarPrice.toString() : '')}
            onChangeText={(value) => handleProductoInputChange('precio_dolar', value)}
            keyboardType="numeric"
            editable={dolarEditable}
            style={!dolarEditable ? styles.dolarInputDisabled : undefined}
          />
        </View>

        {/* Formulario de producto */}
        <View style={styles.productForm}>
          <Text style={styles.sectionTitle}>Agregar Producto al Lote</Text>
          
          <InputField
            label="Producto *"
            placeholder="Selecciona un producto"
            value={currentProducto.id_producto}
            onChangeText={(value) => handleProductoInputChange('id_producto', value)}
          />

          {/* Lista de productos disponibles */}
          {productosDisponibles.length > 0 && (
            <View style={styles.productosList}>
              <Text style={styles.productosTitle}>Productos Disponibles:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.productosContainer}>
                  {productosDisponibles.map((producto) => (
                    <TouchableOpacity
                      key={producto.id_producto}
                      style={[
                        styles.productoChip,
                        currentProducto.id_producto === producto.id_producto.toString() && styles.productoChipSelected
                      ]}
                      onPress={() => handleProductoInputChange('id_producto', producto.id_producto.toString())}
                    >
                      <Text style={[
                        styles.productoChipText,
                        currentProducto.id_producto === producto.id_producto.toString() && styles.productoChipTextSelected
                      ]}>
                        {producto.nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="Cantidad *"
                placeholder="0"
                value={currentProducto.cantidad}
                onChangeText={(value) => handleProductoInputChange('cantidad', value)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Precio de Compra (Bs.) *"
                placeholder="0.00"
                value={currentProducto.precio_compra}
                onChangeText={(value) => handleProductoInputChange('precio_compra', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <ButtonPrimary
            title="Agregar Producto"
            onPress={handleAgregarProducto}
            disabled={!isProductoValid}
            variant="outline"
            style={styles.addProductButton}
          />
        </View>

        {/* Lista de productos agregados */}
        {hasProductos && (
          <View style={styles.productosAgregados}>
            <Text style={styles.sectionTitle}>
              Productos en el Lote ({productosData.length})
            </Text>
            <FlatList
              data={productosData}
              renderItem={renderProductoItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actions}>
          <ButtonPrimary
            title={`Guardar Lote con ${productosData.length} Productos`}
            onPress={handleGuardarLote}
            loading={loading}
            disabled={!hasProductos || loading}
            style={styles.saveButton}
          />

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={irAlPasoAnterior}
          >
            <Text style={styles.cancelButtonText}>Volver Atrás</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSolid,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  dolarSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dolarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dolarTitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  editToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  editToggleText: {
    ...Typography.bodySmall,
    color: Colors.primarySolid,
    fontWeight: '500',
  },
  dolarInputDisabled: {
    backgroundColor: Colors.textDisabled + '20',
  },
  productForm: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  productosList: {
    marginBottom: Spacing.lg,
  },
  productosTitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  productosContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  productoChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textDisabled + '30',
  },
  productoChipSelected: {
    backgroundColor: Colors.primarySolid,
    borderColor: Colors.primarySolid,
  },
  productoChipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  productoChipTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  halfInput: {
    flex: 1,
  },
  addProductButton: {
    marginBottom: Spacing.lg,
  },
  productosAgregados: {
    marginBottom: Spacing.xl,
  },
  productoItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  productoDetalles: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  productoDolar: {
    ...Typography.bodySmall,
    color: Colors.primarySolid,
    fontWeight: '500',
  },
  removeButton: {
    padding: Spacing.sm,
    alignSelf: 'center',
  },
  actions: {
    marginTop: 'auto',
  },
  saveButton: {
    marginBottom: Spacing.md,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});