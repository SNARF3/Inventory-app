import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { db } from '../db/data_base';

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
}

export const useRegisterLogic = () => {
  // Estados del formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
  });
  
  const [touched, setTouched] = useState({
    nombre: false,
    apellido: false,
    email: false,
    password: false,
    confirmPassword: false,
    telefono: false,
  });
  
  const [loading, setLoading] = useState(false);

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

  // Función para hashear la contraseña
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

  // Guardar sesión con ID del usuario
  const saveUserSession = async (userId: number, email: string, nombre: string, apellido: string) => {
    try {
      const session = {
        userId,
        userEmail: email,
        userName: `${nombre} ${apellido}`
      };
      
      await AsyncStorage.setItem('user_session', JSON.stringify(session));
      console.log('✅ Sesión guardada con ID:', userId);
    } catch (error) {
      console.error('Error guardando sesión:', error);
      throw new Error('No se pudo guardar la sesión');
    }
  };

  // Verificar si el email ya existe en la base de datos
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const result = db.getAllSync(
        'SELECT * FROM usuario WHERE correo = ?;',
        [email]
      ) as any[];
      
      return result.length > 0;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    }
  };

  // Registrar usuario en la base de datos y obtener el ID
  const registerUserInDB = async (userData: Omit<RegisterFormData, 'confirmPassword'> & { hashedPassword: string }): Promise<number> => {
    try {
      const { nombre, apellido, email, hashedPassword, telefono } = userData;
      
      const sql = `
        INSERT INTO usuario (nombre, apellido, correo, contrasenia, telefono) 
        VALUES (?, ?, ?, ?, ?);
      `;
      
      const params = [nombre, apellido, email, hashedPassword, parseInt(telefono)];
      
      // Insertar usuario
      const result = db.runSync(sql, params);
      console.log('✅ Usuario registrado en BD');
      
      // Obtener el ID del usuario recién insertado
      const getUserSql = 'SELECT id_user FROM usuario WHERE correo = ?;';
      const userResult = db.getAllSync(getUserSql, [email]) as { id_user: number }[];
      
      if (userResult.length === 0) {
        throw new Error('No se pudo obtener el ID del usuario creado');
      }
      
      const userId = userResult[0].id_user;
      console.log('✅ ID de usuario obtenido:', userId);
      return userId;
      
    } catch (error) {
      console.error('Error registrando usuario en BD:', error);
      throw new Error('No se pudo registrar el usuario en la base de datos');
    }
  };

  // Manejo de cambios en los inputs
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejo de blur en los inputs
  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Manejo especial para teléfono (solo números)
  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange('telefono', numericValue);
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {
      nombre: !formData.nombre.trim() ? 'El nombre es requerido' : '',
      apellido: !formData.apellido.trim() ? 'El apellido es requerido' : '',
      email: !formData.email ? 'El email es requerido' : 
             !/\S+@\S+\.\S+/.test(formData.email) ? 'Email inválido' : '',
      password: formData.password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '',
      confirmPassword: formData.password !== formData.confirmPassword ? 'Las contraseñas no coinciden' : '',
      telefono: !formData.telefono ? 'El teléfono es requerido' : 
               formData.telefono.length !== 8 ? 'El teléfono debe tener 8 dígitos' : '',
    };
    return errors;
  };

  const errors = validateForm();

  // Función de registro completa
  const handleRegister = async () => {
    // Validar formulario antes de proceder
    if (!isFormValid) {
      console.log('Formulario no válido');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Iniciando registro...');

      // 1. Verificar si el email ya existe
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        throw new Error('Este email ya está registrado');
      }

      // 2. Hashear la contraseña
      console.log('🔐 Hasheando contraseña...');
      const hashedPassword = await hashPassword(formData.password);

      // 3. Registrar usuario en la base de datos y OBTENER EL ID
      console.log('💾 Guardando en base de datos...');
      const { confirmPassword, ...userData } = formData;
      const userId = await registerUserInDB({ ...userData, hashedPassword });

      // 4. Guardar sesión automáticamente CON EL ID DEL USUARIO
      console.log('💾 Guardando sesión...');
      await saveUserSession(userId, formData.email, formData.nombre, formData.apellido);

      // 5. Redirigir al home directamente (ya está loggeado)
      console.log('🚀 Redirigiendo al home...');
      router.replace('/views/(tabs)/inventory/homeScreen');

    } catch (error) {
      console.error('❌ Error en registro:', error);
      
      // Mostrar alerta con el error
      if (error instanceof Error) {
        console.log('Error:', error.message);
        // Aquí puedes mostrar un Alert nativo
        // Alert.alert('Error', error.message);
      } else {
        console.log('Error desconocido en el registro');
        // Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  // Validar si el formulario es válido
  const isFormValid = 
    formData.nombre.trim() &&
    formData.apellido.trim() &&
    formData.email && 
    formData.password && 
    formData.confirmPassword &&
    formData.telefono &&
    !errors.nombre &&
    !errors.apellido &&
    !errors.email && 
    !errors.password && 
    !errors.confirmPassword &&
    !errors.telefono;

  // Retornar todo lo necesario
  return {
    // Estados
    formData,
    touched,
    errors,
    loading,
    
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
    handlePhoneChange,
    handleRegister,
    
    // Validaciones
    isFormValid,
  };
};