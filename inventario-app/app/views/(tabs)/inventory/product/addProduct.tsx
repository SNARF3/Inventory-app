import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../../../../constants/theme';
import { useAddProduct } from '../../../../../hooks/use-addProduct';

export default function AddProduct() {
  const {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
  } = useAddProduct();

  // Mover InputField fuera del componente principal para evitar recreaciones
  const InputField = React.useCallback(({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    keyboardType = 'default',
    multiline = false,
    required = false 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    required?: boolean;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDisabled}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        editable={!loading} // Deshabilitar durante loading
      />
    </View>
  ), [loading]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundSolid} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="cube-outline" size={32} color={Colors.primarySolid} />
          <Text style={styles.title}>Agregar Producto</Text>
          <Text style={styles.subtitle}>
            Completa la información del nuevo producto
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <InputField
            label="Nombre del producto"
            value={formData.nameproduct}
            onChangeText={(value) => handleInputChange('nameproduct', value)}
            placeholder="Ej: Laptop Dell XPS 13"
            required
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="Cantidad"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                placeholder="0"
                keyboardType="numeric"
                required
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Stock mínimo"
                value={formData.min_stock}
                onChangeText={(value) => handleInputChange('min_stock', value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="Precio de compra"
                value={formData.buyprice}
                onChangeText={(value) => handleInputChange('buyprice', value)}
                placeholder="0.00"
                keyboardType="numeric"
                required
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Precio de venta"
                value={formData.sellprice}
                onChangeText={(value) => handleInputChange('sellprice', value)}
                placeholder="0.00"
                keyboardType="numeric"
                required
              />
            </View>
          </View>

          <InputField
            label="Cantidad promedio"
            value={formData.averagequantity}
            onChangeText={(value) => handleInputChange('averagequantity', value)}
            placeholder="0"
            keyboardType="numeric"
          />

          <InputField
            label="Descripción"
            value={formData.descriptionproduct}
            onChangeText={(value) => handleInputChange('descriptionproduct', value)}
            placeholder="Describe las características del producto..."
            multiline
          />
        </View>

        {/* Botón de enviar */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <Ionicons name="refresh" size={24} color={Colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
              <Text style={styles.submitButtonText}>Agregar Producto</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Espacio extra al final */}
        <View style={styles.bottomSpacer} />
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textDisabled + '20',
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.textDisabled + '30',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.primarySolid,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 50,
  },
});