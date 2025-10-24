import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../../components/navigation/BottomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="inventory/homeScreen"
        options={{
          title: 'Home',
        }}
      />
      
      <Tabs.Screen
        name="product/addProduct"
        options={{
          title: 'Agregar',
        }}
      />
      
      <Tabs.Screen
        name="users/usuario"
        options={{
          title: 'Usuario',
        }}
      />
    </Tabs>
  );
}