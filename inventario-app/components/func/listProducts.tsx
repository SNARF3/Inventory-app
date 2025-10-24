import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { Producto } from '../../hooks/useProducts';

type Props = {
  productos: Producto[];
  cargarMas: () => void;
  hasMore: boolean;
  loading: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function ListProducts({ 
  productos, 
  cargarMas, 
  hasMore, 
  loading, 
  refreshing = false,
  onRefresh 
}: Props) {
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primarySolid} />
        <Text style={styles.footerText}>Cargando más productos...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={64} color={Colors.textDisabled} />
      <Text style={styles.emptyTitle}>No hay productos</Text>
      <Text style={styles.emptySubtitle}>
        Agrega tu primer producto para comenzar
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Inventario</Text>
      <Text style={styles.subtitle}>
        {productos.length} producto{productos.length !== 1 ? 's' : ''} en stock
      </Text>
    </View>
  );

  const renderProductItem = ({ item }: { item: Producto }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.nameproduct}</Text>
        <View style={[
          styles.quantityBadge,
          item.quantity <= item.min_stock && styles.lowStockBadge
        ]}>
          <Text style={styles.quantityText}>
            {item.quantity} {item.quantity <= item.min_stock ? '⚠️' : ''}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {item.descriptionproduct || 'Sin descripción'}
      </Text>
      
      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio compra:</Text>
          <Text style={styles.buyPrice}>${item.buyprice}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio venta:</Text>
          <Text style={styles.sellPrice}>${item.sellprice}</Text>
        </View>
      </View>
      
      <View style={styles.stockInfo}>
        <Text style={styles.stockText}>
          Stock mínimo: {item.min_stock}
        </Text>
        {item.averagequantity > 0 && (
          <Text style={styles.stockText}>
            Promedio: {item.averagequantity}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={productos}
      keyExtractor={(item) => item.id_product.toString()}
      renderItem={renderProductItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primarySolid]}
            tintColor={Colors.primarySolid}
          />
        ) : undefined
      }
      onEndReached={() => {
        if (hasMore && !loading) cargarMas();
      }}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textDisabled + '20',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  productName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  quantityBadge: {
    backgroundColor: Colors.primarySolid + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  lowStockBadge: {
    backgroundColor: '#fef2f2',
  },
  quantityText: {
    ...Typography.overline,
    color: Colors.primarySolid,
    fontWeight: '600',
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    ...Typography.overline,
    color: Colors.textDisabled,
    marginBottom: 2,
  },
  buyPrice: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sellPrice: {
    ...Typography.body,
    color: Colors.primarySolid,
    fontWeight: '600',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.textDisabled + '20',
    paddingTop: Spacing.sm,
  },
  stockText: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    fontSize: 12,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    minHeight: 300,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});