import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../../../../constants/theme';
import { initDB } from '../../../../../db/data_base';
import { useNavigation } from '../../../../../hooks/use-navigation';
import { Producto, useInfiniteProductos } from '../../../../../hooks/useProducts';

export default function ListProducts() {
  const [dbReady, setDbReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { navigateToTab } = useNavigation();

  // Inicializar la base de datos
  useEffect(() => {
    const prepareDB = async () => {
      await initDB();
      setDbReady(true);
    };
    prepareDB();
  }, []);

  // Hook para productos
  const { productos, cargarMas, hasMore, loading, refreshProductos } = useInfiniteProductos(20, dbReady);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProductos();
    setRefreshing(false);
  };

  const onLoadMore = () => {
    if (hasMore && !loading) {
      cargarMas();
    }
  };

  const navigateToAddProduct = () => {
    navigateToTab('/views/(tabs)/product/addProduct');
  };

  // Función para renderizar cada item de producto
  const renderProductItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <Text style={styles.productName}>{item.nameproduct}</Text>
          {item.quantity <= item.min_stock && (
            <View style={styles.warningIndicator}>
              <Ionicons name="warning" size={16} color={Colors.error} />
            </View>
          )}
        </View>
        <View style={[
          styles.quantityBadge,
          item.quantity <= item.min_stock && styles.lowStockBadge
        ]}>
          <Text style={[
            styles.quantityText,
            item.quantity <= item.min_stock && styles.lowStockText
          ]}>
            {item.quantity} {item.quantity <= item.min_stock ? '' : ''}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {item.descriptionproduct || 'Sin descripción'}
      </Text>
      
      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Compra</Text>
          <Text style={styles.buyPrice}>${item.buyprice}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Venta</Text>
          <Text style={styles.sellPrice}>${item.sellprice}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Margen</Text>
          <Text style={styles.marginText}>
            {((item.sellprice - item.buyprice) / item.buyprice * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.stockInfo}>
        <View style={styles.stockItem}>
          <Ionicons name="trending-down" size={14} color={Colors.textDisabled} />
          <Text style={styles.stockText}>Mín: {item.min_stock}</Text>
        </View>
        {item.averagequantity > 0 && (
          <View style={styles.stockItem}>
            <Ionicons name="pulse" size={14} color={Colors.textDisabled} />
            <Text style={styles.stockText}>Prom: {item.averagequantity}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Mientras DB no está lista, mostrar loader
  if (!dbReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primarySolid} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

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
      <View style={styles.emptyIcon}>
        <Ionicons name="cube-outline" size={80} color={Colors.textDisabled + '80'} />
      </View>
      <Text style={styles.emptyTitle}>No hay productos</Text>
      <Text style={styles.emptySubtitle}>
        Presiona el botón + para agregar tu primer producto
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Productos</Text>
        <Text style={styles.subtitle}>
          {productos.length} producto{productos.length !== 1 ? 's' : ''} en inventario
        </Text>
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="filter" size={20} color={Colors.primarySolid} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Lista de productos */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id_product.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primarySolid]}
            tintColor={Colors.primarySolid}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Botón flotante para agregar producto */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={navigateToAddProduct}
        activeOpacity={0.8}
      >
        <View style={styles.fabBackground}>
          <Ionicons name="add" size={28} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSolid,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSolid,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textDisabled + '15',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  filterButton: {
    padding: Spacing.sm,
    borderRadius: 10,
    backgroundColor: Colors.primarySolid + '10',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.primarySolid,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primarySolid,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  productName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  warningIndicator: {
    padding: 2,
  },
  quantityBadge: {
    backgroundColor: Colors.primarySolid + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  lowStockBadge: {
    backgroundColor: Colors.error + '15',
  },
  quantityText: {
    ...Typography.overline,
    color: Colors.primarySolid,
    fontWeight: '700',
    fontSize: 14,
  },
  lowStockText: {
    color: Colors.error,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
    fontSize: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundSolid,
    borderRadius: 12,
    padding: Spacing.sm,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    ...Typography.overline,
    color: Colors.textDisabled,
    marginBottom: 4,
    fontSize: 11,
    fontWeight: '500',
  },
  buyPrice: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  sellPrice: {
    ...Typography.body,
    color: Colors.primarySolid,
    fontWeight: '700',
    fontSize: 15,
  },
  marginText: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
    fontSize: 14,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: Colors.textDisabled + '30',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.textDisabled + '15',
    paddingTop: Spacing.md,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    fontSize: 12,
    marginLeft: 4,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
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
    minHeight: 400,
  },
  emptyIcon: {
    padding: Spacing.xl,
    backgroundColor: Colors.backgroundSolid,
    borderRadius: 40,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontSize: 22,
    fontWeight: '600',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: 100, // Espacio sobre el BottomTabBar
    zIndex: 10,
  },
  fabBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primarySolid,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primarySolid,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: Colors.white,
  },
});