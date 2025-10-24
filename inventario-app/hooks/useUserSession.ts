// hooks/useUserSession.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface UserSession {
  userId: number;
  userEmail: string;
  userName: string;
}

export const useUserSession = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const savedSession = await AsyncStorage.getItem('user_session');
      if (savedSession) {
        const session: UserSession = JSON.parse(savedSession);
        setUserSession(session);
        console.log('✅ Sesión cargada:', session);
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserId = (): number | null => {
    return userSession?.userId || null;
  };

  const getUserEmail = (): string | null => {
    return userSession?.userEmail || null;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_session');
      setUserSession(null);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  };

  return {
    userSession,
    loading,
    getUserId,
    getUserEmail,
    logout,
    isLoggedIn: !!userSession,
  };
};