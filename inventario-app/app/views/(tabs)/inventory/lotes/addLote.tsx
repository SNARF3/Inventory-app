import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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

export default function AddLoteScreen() {
  const {
    currentStep,
    loteData,
    loading,
    dolarPrice,
    handleLoteInputChange,
    isLoteValid,
    irAlSiguientePaso,
    fetchDolarPrice,
  } = useAddLote();

  const [refreshingDolar, setRefreshingDolar] = useState(false);

  const handleRefreshDolar = async () => {
    setRefreshingDolar(true);
    try {
      await fetchDolarPrice();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el precio del dólar');
    } finally {
      setRefreshingDolar(false);
    }
  };

  // Si estamos en el paso 2, redirigir al componente de productos
  if (currentStep === 2) {
    router.replace('/views/(tabs)/inventory/lotes/addLoteProducto');
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="cube-outline" size={32} color={Colors.primarySolid} />
          <HeaderText variant="h1">Nuevo Lote</HeaderText>
          <Text style={styles.subtitle}>
            Paso 1: Información básica del lote
          </Text>
        </View>

        {/* Información del dólar */}
        <View style={styles.dolarSection}>
          <View style={styles.dolarHeader}>
            <Text style={styles.dolarTitle}>Precio del Dólar</Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefreshDolar}
              disabled={refreshingDolar}
            >
              <Ionicons 
                name="refresh" 
                size={20} 
                color={Colors.primarySolid} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.dolarValue}>
            {dolarPrice ? `Bs. ${dolarPrice.toFixed(2)}` : 'Cargando...'}
          </Text>
          <Text style={styles.dolarSource}>
            Fuente: Binance • Actualizado automáticamente
          </Text>
        </View>

        {/* Formulario del lote */}
        <View style={styles.form}>
          <InputField
            label="Detalle del Lote (Opcional)"
            placeholder="Ej: Lote de importación Octubre 2024"
            value={loteData.detalle_lote}
            onChangeText={(value) => handleLoteInputChange('detalle_lote', value)}
            multiline
            numberOfLines={3}
          />

          <InputField
            label="Fecha de Fin del Lote *"
            placeholder="YYYY-MM-DD"
            value={loteData.fecha_fin}
            onChangeText={(value) => handleLoteInputChange('fecha_fin', value)}
          />

          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Requisitos para continuar:</Text>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={loteData.fecha_fin ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={loteData.fecha_fin ? Colors.primarySolid : Colors.textDisabled} 
              />
              <Text style={styles.requirementText}>Fecha de fin del lote</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={dolarPrice ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={dolarPrice ? Colors.primarySolid : Colors.textDisabled} 
              />
              <Text style={styles.requirementText}>Precio del dólar cargado</Text>
            </View>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <ButtonPrimary
            title="Continuar a Productos"
            onPress={irAlSiguientePaso}
            loading={loading}
            disabled={!isLoteValid || !dolarPrice || loading}
            style={styles.continueButton}
          />

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
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
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textDisabled + '20',
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
    marginBottom: Spacing.xs,
  },
  dolarTitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 4,
  },
  dolarValue: {
    ...Typography.h2,
    color: Colors.primarySolid,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  dolarSource: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    fontSize: 12,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  requirements: {
    backgroundColor: Colors.primarySolid + '10',
    padding: Spacing.lg,
    borderRadius: 8,
    marginTop: Spacing.lg,
  },
  requirementsTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requirementText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  actions: {
    marginTop: 'auto',
  },
  continueButton: {
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