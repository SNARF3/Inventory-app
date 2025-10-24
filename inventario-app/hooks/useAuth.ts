// hooks/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface UserSession {
  userId: number;
  userEmail: string;
  userName: string;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al iniciar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedSession = await AsyncStorage.getItem('user_session');
      
      if (savedSession) {
        const session: UserSession = JSON.parse(savedSession);
        setUserSession(session);
        setIsLoggedIn(true);
        console.log('✅ Sesión recuperada:', session);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId: number, userEmail: string, userName: string) => {
    try {
      const session: UserSession = {
        userId,
        userEmail,
        userName
      };
      
      await AsyncStorage.setItem('user_session', JSON.stringify(session));
      setUserSession(session);
      setIsLoggedIn(true);
      console.log('✅ Sesión guardada:', session);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_session');
      setUserSession(null);
      setIsLoggedIn(false);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  const getUserId = (): number => {
    if (!userSession) {
      throw new Error('Usuario no autenticado');
    }
    return userSession.userId;
  };

  return {
    isLoggedIn,
    userSession,
    loading,
    login,
    logout,
    checkAuthStatus,
    getUserId,
  };
};