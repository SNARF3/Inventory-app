import { useRouter } from 'expo-router';

export type AppRoute = 
  | '/views/management/Administracion'
  | '/views/management/Agregar'
  | '/views/users/usuario'
  | '/views/login'
  | '/views/register'
  | '/views/(tabs)/inventory/homeScreen'  // ✅ Agregar esta ruta
  | '/views/(tabs)/product/addProduct'  // ✅ Agregar esta ruta
  | '/views/(tabs)/product/editProduct'  // ✅ Agregar esta ruta
  | '/views/(tabs)/product/ListProducts'  // ✅ Agregar esta ruta
  | '/views/(tabs)/lotes/ListLotes'  // ✅ Agregar esta ruta
  | '/views/(tabs)/inventory/lotes/addLote'  // ✅ Agregar esta ruta
  | '/views/(tabs)/inventory/lotes/addLoteProducto'  // ✅ Agregar esta ruta
  | '/views/auth/login'                   // ✅ Agregar esta ruta
  | '/views/auth/Register';               // ✅ Agregar esta ruta

export const useNavigation = () => {
  const router = useRouter();

  const navigateToTab = (route: AppRoute) => {
    router.push(route as any);
  };

  const navigateToLogin = () => {
    router.replace('/views/auth/login');
  };

  const navigateToRegister = () => {
    router.push('/views/auth/Register');
  };

  return {
    navigateToTab,
    navigateToLogin,
    navigateToRegister,
  };
};