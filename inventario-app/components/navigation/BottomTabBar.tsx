import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useNavigation } from '../../hooks/use-navigation';

interface TabBarProps {
  state: any;
  navigation: any;
}

export const BottomTabBar: React.FC<TabBarProps> = ({ state, navigation }) => {
  const { navigateToTab } = useNavigation();

  const tabs = [
    {
      name: 'productos',
      label: 'Productos',
      icon: 'cube',
      route: '/views/(tabs)/product/ListProducts' as const,
    },
    {
      name: 'lotes',
      label: 'Lotes',
      icon: 'layers',
      route: '/views/(tabs)/lotes/ListLotes' as const,
    },
    {
      name: 'usuarios',
      label: 'Usuarios',
      icon: 'people',
      route: '/views/users/usuario' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigateToTab(tab.route)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.tabIconContainer,
              isFocused && styles.tabIconContainerActive
            ]}>
              <Ionicons
                name={tab.icon as any}
                size={24}
                color={isFocused ? Colors.primarySolid : Colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? Colors.primarySolid : Colors.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: 80,
    paddingBottom: 8,
    marginBottom: 14,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    marginHorizontal: 16,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundSolid,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
  tabIconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  tabIconContainerActive: {
    backgroundColor: Colors.primarySolid + '10',
  },
  tabLabel: {
    ...Typography.overline,
    fontSize: 10,
    fontWeight: '500',
  },
});