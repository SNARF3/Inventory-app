import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Colors } from '../constants/theme';
import { getDBInfo, initDB, reinitializeDatabase } from '../db/data_base';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('🚀 Iniciando aplicación...');
        
        // 1. Reiniciar la base de datos (borra la vieja y crea nueva)
        console.log('🗑️  Reinicializando base de datos...');
        const resetSuccess = await reinitializeDatabase();
        
        if (!resetSuccess) {
          throw new Error('No se pudo reinicializar la base de datos');
        }

        // 2. Inicializar con el nuevo modelo
        console.log('📝 Inicializando con nuevo modelo...');
        const initSuccess = await initDB();
        
        if (!initSuccess) {
          throw new Error('No se pudo inicializar la base de datos');
        }

        // 3. Verificar que todo esté correcto
        console.log('🔍 Verificando estructura...');
        await getDBInfo();

        console.log('✅ Base de datos lista con nueva estructura');
        
      } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  // Mostrar loading mientras se inicializa
  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.backgroundSolid 
      }}>
        <ActivityIndicator size="large" color={Colors.primarySolid} />
        <Text style={{ 
          marginTop: 16, 
          color: Colors.textSecondary,
          fontSize: 16 
        }}>
          Inicializando base de datos...
        </Text>
      </View>
    );
  }

  // Mostrar error si algo falló
  if (error) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.backgroundSolid,
        padding: 20 
      }}>
        <Text style={{ 
          color: '#ef4444',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 10
        }}>
          Error al inicializar la aplicación
        </Text>
        <Text style={{ 
          color: Colors.textSecondary,
          textAlign: 'center',
          fontSize: 14 
        }}>
          {error}
        </Text>
        <Text style={{ 
          color: Colors.textDisabled,
          textAlign: 'center',
          fontSize: 12,
          marginTop: 20 
        }}>
          Reinicia la aplicación para intentarlo nuevamente
        </Text>
      </View>
    );
  }

  // Redirigir al login cuando todo esté listo
  return <Redirect href="/views/auth/login" />;
}