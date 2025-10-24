import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { db } from '../db/data_base';

export const useLoginLogic = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  // Animaciones
  const headerSlideUp = useRef(new Animated.Value(50)).current;
  const formSlideUp = useRef(new Animated.Value(80)).current;
  const buttonSlideUp = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Efecto para animaciones
  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlideUp, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(formSlideUp, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Función para hashear la contraseña (igual que en registro)
  const hashPassword = async (password: string): Promise<string> => {
    try {
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      return hash;
    } catch (error) {
      console.error('Error hasheando contraseña:', error);
      throw new Error('No se pudo procesar la contraseña');
    }
  };

  // Función para guardar sesión del usuario
  const saveUserSession = async (userId: number, email: string, nombre: string, apellido: string) => {
    try {
      const session = {
        userId,
        userEmail: email,
        userName: `${nombre} ${apellido}`
      };
      
      await AsyncStorage.setItem('user_session', JSON.stringify(session));
      console.log('✅ Sesión guardada para:', email);
    } catch (error) {
      console.error('Error guardando sesión:', error);
      throw new Error('No se pudo guardar la sesión');
    }
  };

  // Validar credenciales en la base de datos
  const validateCredentials = async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      console.log('🔐 Validando credenciales...');
      
      // 1. Buscar usuario por email
      const userResult = db.getAllSync(
        'SELECT * FROM usuario WHERE correo = ?;',
        [email]
      ) as any[];

      if (userResult.length === 0) {
        return { 
          success: false, 
          error: 'Usuario no encontrado' 
        };
      }

      const user = userResult[0];
      console.log('✅ Usuario encontrado:', user.correo);

      // 2. Hashear la contraseña ingresada para comparar
      const hashedPassword = await hashPassword(password);
      
      // 3. Comparar contraseñas hasheadas
      if (user.contrasenia !== hashedPassword) {
        return { 
          success: false, 
          error: 'Contraseña incorrecta' 
        };
      }

      console.log('✅ Credenciales válidas');
      return { 
        success: true, 
        user: {
          id: user.id_user,
          email: user.correo,
          nombre: user.nombre,
          apellido: user.apellido
        }
      };

    } catch (error) {
      console.error('Error validando credenciales:', error);
      return { 
        success: false, 
        error: 'Error al validar credenciales' 
      };
    }
  };

  // Validación del formulario (validación básica)
  const validateForm = () => {
    const errors = {
      email: !formData.email ? 'El email es requerido' : 
             !/\S+@\S+\.\S+/.test(formData.email) ? 'Email inválido' : '',
      password: !formData.password ? 'La contraseña es requerida' : '',
    };
    return errors;
  };

  const errors = validateForm();

  // Manejo de cambios en los inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (loginError) {
      setLoginError('');
    }
  };

  // Manejo de blur en los inputs
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Función de login real
  const handleLogin = async () => {
    // Validación básica del formulario
    if (!isFormValid) {
      console.log('Formulario no válido');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      console.log('🔄 Iniciando proceso de login...');

      // 1. Validar credenciales en la base de datos
      const validation = await validateCredentials(formData.email, formData.password);
      
      if (!validation.success) {
        throw new Error(validation.error || 'Error en la autenticación');
      }

      if (!validation.user) {
        throw new Error('No se pudo obtener información del usuario');
      }

      // 2. Guardar sesión del usuario
      console.log('💾 Guardando sesión...');
      await saveUserSession(
        validation.user.id,
        validation.user.email,
        validation.user.nombre,
        validation.user.apellido
      );

      // 3. Redirigir a la pantalla principal
      console.log('🚀 Redirigiendo al home...');
      router.replace('/views/(tabs)/inventory/homeScreen');

    } catch (error) {
      console.error('❌ Error en login:', error);
      
      // Mostrar error específico al usuario
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  // Validar si el formulario es válido (solo validación básica)
  const isFormValid = 
    formData.email && 
    formData.password &&
    !errors.email && 
    !errors.password;

  // Retornar todo lo necesario
  return {
    // Estados
    formData,
    touched,
    errors,
    loading,
    loginError,
    
    // Animaciones
    animations: {
      headerSlideUp,
      formSlideUp,
      buttonSlideUp,
      fadeAnim,
    },
    
    // Funciones
    handleInputChange,
    handleBlur,
    handleLogin,
    
    // Validaciones
    isFormValid,
  };
};