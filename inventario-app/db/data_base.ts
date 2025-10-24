import * as SQLite from 'expo-sqlite';
import dbModel from './model';

// Abrir la base de datos con manejo de errores
let db: SQLite.SQLiteDatabase;

try {
  db = SQLite.openDatabaseSync('inventario.db');
  console.log('✅ Base de datos abierta correctamente');
} catch (error) {
  console.error('❌ Error al abrir la base de datos:', error);
  throw new Error('No se pudo inicializar la base de datos');
}

// Función para borrar y recrear la base de datos
export const resetDatabase = async (): Promise<boolean> => {
  try {
    console.log('🗑️  Borrando base de datos existente...');
    
    // Cerrar la conexión actual si existe
    if (db) {
      await db.closeAsync();
    }
    
    // Borrar el archivo de la base de datos
    await SQLite.deleteDatabaseSync('inventario.db');
    console.log('✅ Base de datos borrada');
    
    // Reabrir la base de datos
    db = SQLite.openDatabaseSync('inventario.db');
    console.log('✅ Nueva base de datos creada');
    
    return true;
  } catch (error) {
    console.error('❌ Error borrando base de datos:', error);
    return false;
  }
};

// Función para resetear completamente la base de datos
export const reinitializeDatabase = async (): Promise<boolean> => {
  try {
    await resetDatabase();
    return await initDB();
  } catch (error) {
    console.error('❌ Error reinicializando base de datos:', error);
    return false;
  }
};

// Función para inicializar la base de datos CON EL MODELO
export const initDB = async (): Promise<boolean> => {
  try {
    console.log('🔄 Inicializando base de datos con el modelo..');
    
    if (!dbModel) {
      throw new Error('No se encontró el modelo de la base de datos');
    }

    const queries = dbModel
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--')); // Filtrar comentarios

    console.log(`📝 Ejecutando ${queries.length} queries del modelo...`);

    await db.withTransactionAsync(async () => {
      for (const query of queries) {
        if (query) {
          try {
            await db.runSync(query + ';');
            console.log('✅ Query ejecutado:', query.substring(0, 50) + '...');
          } catch (queryError) {
            // Ignorar errores de "table already exists" para desarrollo
            if (queryError instanceof Error && queryError.message.includes('already exists')) {
              console.log('ℹ️  Tabla ya existe:', query.substring(0, 30) + '...');
            } else {
              console.error('❌ Error en query:', query, queryError);
            }
          }
        }
      }
    });

    console.log('✅ Base de datos inicializada correctamente con el modelo');
    return true;
  } catch (error) {
    console.error('❌ Error crítico inicializando base de datos:', error);
    return false;
  }
};

// Función para verificar el estado de la base de datos
export const checkDBStatus = (): boolean => {
  try {
    // Intentar una consulta simple para verificar la conexión
    db.execSync('SELECT 1;');
    console.log('✅ Base de datos conectada y funcionando');
    return true;
  } catch (error) {
    console.error('❌ Error verificando estado de la base de datos:', error);
    return false;
  }
};

// Función para obtener información de las tablas (útil para debug)
export const getDBInfo = async (): Promise<void> => {
  try {
    const tables = db.getAllSync(
      "SELECT name FROM sqlite_master WHERE type='table';"
    ) as { name: string }[];
    
    console.log('📊 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
  } catch (error) {
    console.error('❌ Error obteniendo información de la BD:', error);
  }
};

// Función para cerrar la base de datos (útil para limpieza)
export const closeDB = async (): Promise<void> => {
  try {
    await db.closeAsync();
    console.log('✅ Base de datos cerrada correctamente');
  } catch (error) {
    console.error('❌ Error cerrando base de datos:', error);
  }
};

// Función para obtener la instancia de la base de datos
export const getDB = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Base de datos no inicializada');
  }
  return db;
};

// Exportar la instancia de la base de datos
export { db };
