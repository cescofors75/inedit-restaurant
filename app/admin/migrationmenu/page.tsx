"use client"

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle, AlertCircle, Play, RefreshCw, ArrowRight, Database, Upload } from 'lucide-react';

// Definición de tipos
interface MigrationStatus {
  total: number;
  processed: number;
  success: number;
  error: number;
  logs: Array<{
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    timestamp: Date;
  }>;
}

// Tipos de items a migrar
type ItemType = 'categories' | 'items';

export default function MenuMigrationPage() {
  // Estados para controlar la migración
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    total: 0,
    processed: 0,
    success: 0,
    error: 0,
    logs: []
  });
  const [jsonData, setJsonData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'database'>('overview');
  const [dbTables, setDbTables] = useState<{ name: string, count: number }[]>([]);
  
  // Referencia para el área de logs
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Cargar información de la base de datos cuando cambia a la pestaña "database"
  useEffect(() => {
    if (activeTab === 'database') {
      fetchDatabaseInfo();
    }
  }, [activeTab]);

  // Auto-scroll al final de los logs cuando se agregan nuevos
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [migrationStatus.logs]);

  // Función para obtener información de las tablas de la base de datos
  const fetchDatabaseInfo = async () => {
    try {
      // Obtener conteo de registros para cada tabla
      const tables = ['menu_categories', 'menu_items'];
      const tableData = [];

      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        tableData.push({ name: table, count: count || 0 });
      }

      setDbTables(tableData);
    } catch (error) {
      console.error('Error fetching database info:', error);
      addLog('error', `Error al obtener información de la base de datos: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Función para agregar un log
  const addLog = (type: 'info' | 'success' | 'error' | 'warning', message: string) => {
    setMigrationStatus(prevStatus => ({
      ...prevStatus,
      logs: [
        ...prevStatus.logs,
        {
          type,
          message,
          timestamp: new Date()
        }
      ]
    }));
  };

  // Función para cargar el archivo JSON desde public/data/menu.json
  const loadJsonFile = async () => {
    setIsLoading(true);
    addLog('info', 'Iniciando carga del archivo JSON desde public/data/menu.json...');
    
    try {
      // Cargar directamente el archivo JSON desde la carpeta public
      const response = await fetch('/data/menu.json');
      if (!response.ok) {
        throw new Error(`Error al cargar el archivo: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setJsonData(data);
      
      const totalItems = 
        (data.categories?.length || 0) + 
        (data.items?.length || 0);
      
      setMigrationStatus(prev => ({
        ...prev,
        total: totalItems
      }));
      
      addLog('success', `Archivo JSON cargado: ${data.categories?.length || 0} categorías, ${data.items?.length || 0} items`);
    } catch (error) {
      console.error('Error loading JSON file:', error);
      addLog('error', `Error al cargar el archivo JSON: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para migrar un tipo específico de datos
  const migrateItems = async (type: ItemType) => {
    if (!jsonData) {
      addLog('error', 'No hay datos JSON para migrar');
      return;
    }
    
    addLog('info', `Iniciando migración de ${type}...`);
    
    try {
      switch (type) {
        case 'categories':
          await migrateCategories();
          break;
        case 'items':
          await migrateMenuItems();
          break;
      }
    } catch (error) {
      console.error(`Error migrating ${type}:`, error);
      addLog('error', `Error al migrar ${type}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Función para migrar categorías
  const migrateCategories = async () => {
    const { categories } = jsonData;
    
    if (!categories || !Array.isArray(categories)) {
      addLog('error', 'No se encontraron categorías válidas');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const category of categories) {
      try {
        const { id, name, slug, description } = category;
        
        const { data, error } = await supabase
          .from('menu_categories')
          .insert({
            id,
            name_en: name.en,
            name_es: name.es,
            name_ca: name.ca,
            name_fr: name.fr,
            name_it: name.it,
            name_de: name.de,
            name_ru: name.ru,
            slug,
            description_en: description?.en,
            description_es: description?.es,
            description_ca: description?.ca,
            description_fr: description?.fr,
            description_it: description?.it,
            description_de: description?.de,
            description_ru: description?.ru
          });
        
        if (error) throw error;
        
        successCount++;
        addLog('success', `Categoría migrada: ${id}`);
      } catch (error) {
        errorCount++;
        addLog('error', `Error al migrar categoría ${category.id}: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        // Actualizar el estado de la migración
        setMigrationStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          success: prev.success + successCount,
          error: prev.error + errorCount
        }));
      }
    }
    
    addLog('info', `Migración de categorías completada: ${successCount} exitosas, ${errorCount} errores`);
  };

  // Función para migrar items del menú
  const migrateMenuItems = async () => {
    const { items } = jsonData;
    
    if (!items || !Array.isArray(items)) {
      addLog('error', 'No se encontraron items válidos para migrar');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of items) {
      try {
        const {
          id, name, description, price, categoryId, image
        } = item;
        
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            id,
            name_en: name.en,
            name_es: name.es,
            name_ca: name.ca,
            name_fr: name.fr,
            name_it: name.it,
            name_de: name.de,
            name_ru: name.ru,
            description_en: description?.en,
            description_es: description?.es,
            description_ca: description?.ca,
            description_fr: description?.fr,
            description_it: description?.it,
            description_de: description?.de,
            description_ru: description?.ru,
            price: parseFloat(price),
            category_id: categoryId,
            image
          });
        
        if (error) throw error;
        
        successCount++;
        addLog('success', `Item migrado: ${id}`);
      } catch (error) {
        errorCount++;
        addLog('error', `Error al migrar item ${item.id}: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        // Actualizar el estado de la migración
        setMigrationStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          success: prev.success + successCount,
          error: prev.error + errorCount
        }));
      }
    }
    
    addLog('info', `Migración de items completada: ${successCount} exitosos, ${errorCount} errores`);
    setIsComplete(true);
  };

  // Iniciar la migración completa
  const startMigration = async () => {
    setIsLoading(true);
    setIsComplete(false);
    
    // Resetear el estado de la migración
    setMigrationStatus({
      total: jsonData ? 
        (jsonData.categories?.length || 0) + 
        (jsonData.items?.length || 0) : 0,
      processed: 0,
      success: 0,
      error: 0,
      logs: [{
        type: 'info',
        message: 'Iniciando proceso de migración...',
        timestamp: new Date()
      }]
    });
    
    try {
      // Migrar en orden: categorías -> items
      await migrateItems('categories');
      await migrateItems('items');
      
      addLog('success', 'Proceso de migración completado');
      fetchDatabaseInfo();
    } catch (error) {
      console.error('Migration error:', error);
      addLog('error', `Error en el proceso de migración: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear la migración
  const resetMigration = () => {
    setJsonData(null);
    setIsComplete(false);
    setMigrationStatus({
      total: 0,
      processed: 0,
      success: 0,
      error: 0,
      logs: []
    });
  };

  // Calcular progreso como porcentaje
  const progress = migrationStatus.total > 0 
    ? Math.round((migrationStatus.processed / migrationStatus.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Migración de Datos del Menú
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            Herramienta para migrar los datos desde <code className="bg-gray-100 px-1 py-0.5 rounded">public/data/menu.json</code> a tablas relacionales en Supabase
          </p>
        </div>

        {/* Panel principal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabecera con progreso */}
          <div className="px-6 py-8 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                {isComplete 
                  ? 'Migración completada' 
                  : isLoading 
                    ? 'Migrando datos...' 
                    : jsonData 
                      ? 'Datos listos para migrar' 
                      : 'Cargar datos para iniciar'
                }
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  {migrationStatus.total > 0 && (
                    <>
                      <Database className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>{migrationStatus.processed} de {migrationStatus.total} elementos procesados</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-24 h-24 flex-shrink-0">
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: isComplete 
                    ? (migrationStatus.error > 0 ? '#f87171' : '#4ade80') 
                    : '#3b82f6',
                  textColor: '#1f2937',
                  trailColor: '#e5e7eb',
                })}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex space-x-3">
                {!jsonData && (
                  <button
                    onClick={loadJsonFile}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <Upload className="-ml-1 mr-2 h-4 w-4" />
                        Cargar JSON
                      </>
                    )}
                  </button>
                )}

                {jsonData && !isComplete && (
                  <button
                    onClick={startMigration}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Migrando...
                      </>
                    ) : (
                      <>
                        <Play className="-ml-1 mr-2 h-4 w-4" />
                        Iniciar Migración
                      </>
                    )}
                  </button>
                )}

                {(isComplete || jsonData) && (
                  <button
                    onClick={resetMigration}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                    Reiniciar
                  </button>
                )}
              </div>

              {/* Pestañas para cambiar de vista */}
              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'overview' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'logs' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Registros
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'database' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Base de Datos
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="px-6 py-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <Database className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Elementos
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {migrationStatus.total}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <RefreshCw className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Procesados
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {migrationStatus.processed}
                              </div>
                              {migrationStatus.total > 0 && (
                                <div className="ml-2 text-sm font-medium text-gray-500">
                                  ({progress}%)
                                </div>
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Éxitos
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {migrationStatus.success}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                          <AlertCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Errores
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {migrationStatus.error}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vista previa de datos */}
                {jsonData && (
                  <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-5 bg-gray-50 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Vista previa de datos del menú
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Estructura de los datos JSON cargados para migración
                      </p>
                    </div>
                    <div className="bg-white px-4 py-5 sm:px-6 overflow-auto max-h-80">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Categorías ({jsonData.categories?.length || 0})
                          </h4>
                          <ul className="mt-1 text-sm text-gray-900 space-y-1">
                            {jsonData.categories?.slice(0, 5).map((cat: any) => (
                              <li key={cat.id} className="flex items-center">
                                <ArrowRight className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="font-medium">{cat.id}</span>: {cat.name.es || cat.name.en}
                              </li>
                            ))}
                            {(jsonData.categories?.length || 0) > 5 && (
                              <li className="text-sm text-gray-500">
                                ...y {jsonData.categories.length - 5} más
                              </li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Items ({jsonData.items?.length || 0})
                          </h4>
                          <ul className="mt-1 text-sm text-gray-900 space-y-1">
                            {jsonData.items?.slice(0, 5).map((item: any) => (
                              <li key={item.id} className="flex items-center">
                                <ArrowRight className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="font-medium">{item.id}</span>: {item.name.es || item.name.en}
                              </li>
                            ))}
                            {(jsonData.items?.length || 0) > 5 && (
                              <li className="text-sm text-gray-500">
                                ...y {jsonData.items.length - 5} más
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

              {activeTab === 'logs' && (
                          <div className="bg-gray-900 rounded-lg text-white p-4 h-96 overflow-auto font-mono text-sm">
                            {migrationStatus.logs.length === 0 ? (
                              <div className="text-gray-500 py-4 text-center">
                                No hay registros disponibles
                              </div>
                            ) : (
                              migrationStatus.logs.map((log, index) => (
                                <div key={index} className={`py-1 ${index % 2 === 0 ? 'bg-opacity-10 bg-white' : ''}`}>
                                  <span className="text-gray-400">[{log.timestamp.toLocaleTimeString()}]</span>
                                  <span className={`font-bold mx-2 ${
                                    log.type === 'success' ? 'text-green-400' :
                                    log.type === 'error' ? 'text-red-400' :
                                    log.type === 'warning' ? 'text-yellow-400' :
                                    'text-blue-400'
                                  }`}>
                                    {log.type.toUpperCase()}
                                  </span>
                                  <span>{log.message}</span>
                                </div>
                              ))
                            )}
                            <div ref={logsEndRef} />
                          </div>
                        )}
            
                        {activeTab === 'database' && (
                          <div className="space-y-6">
                            <div className="text-right">
                              <button
                                onClick={fetchDatabaseInfo}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Actualizar
                                Actualizar
                              </button>
                            </div>
                            
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                              <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                    >
                                      Tabla
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                      Registros
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                      Estado
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                    >
                                      Acciones
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {dbTables.length === 0 ? (
                                    <tr>
                                      <td colSpan={4} className="py-10 text-center text-gray-500">
                                        Cargando información de la base de datos...
                                      </td>
                                    </tr>
                                  ) : (
                                    dbTables.map((table) => (
                                      <tr key={table.name}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                          {table.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {table.count}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                          <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                              table.count > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                          >
                                            {table.count > 0 ? 'Datos disponibles' : 'Sin datos'}
                                          </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                          <button
                                            onClick={() => {
                                              // Aquí podríamos añadir funcionalidad para acciones específicas
                                              addLog('info', `Acción solicitada en tabla ${table.name}`);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                          >
                                            Ver detalles
                                          </button>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
            
                            {/* Información adicional */}
                            <div className="mt-8 bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                                Información de la base de datos
                              </h3>
                              <div className="border-t border-gray-200 pt-4">
                                <dl className="divide-y divide-gray-200">
                                  <div className="py-3 grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Proveedor de base de datos
                                    </dt>
                                    <dd className="text-sm text-gray-900 col-span-2">
                                      Supabase (PostgreSQL)
                                    </dd>
                                  </div>
                                  <div className="py-3 grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Esquema
                                    </dt>
                                    <dd className="text-sm text-gray-900 col-span-2">
                                      public
                                    </dd>
                                  </div>
                                  <div className="py-3 grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Total de registros
                                    </dt>
                                    <dd className="text-sm text-gray-900 col-span-2">
                                      {dbTables.reduce((acc, table) => acc + table.count, 0)}
                                    </dd>
                                  </div>
                                  <div className="py-3 grid grid-cols-3 gap-4">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Última actualización
                                    </dt>
                                    <dd className="text-sm text-gray-900 col-span-2">
                                      {new Date().toLocaleString()}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Pie */}
                      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right text-sm text-gray-500">
                        <p>
                          Herramienta de migración de datos • v1.0.0
                        </p>
                      </div>
                    </div>
            
                    {/* Información sobre el proceso */}
                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Información sobre el proceso de migración
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Guía de uso y detalles técnicos
                        </p>
                      </div>
                      <div className="border-t border-gray-200">
                        <dl>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Origen de datos
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <code className="bg-gray-100 px-1 py-0.5 rounded">/public/data/beverages.json</code>
                            </dd>
                          </div>
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Destino
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              Tablas relacionales en Supabase: <code>beverage_categories</code>, <code>beverage_subcategories</code>, <code>beverage_items</code>
                            </dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Proceso
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <ol className="list-decimal pl-5 space-y-2">
                                <li>Carga del archivo JSON desde la carpeta pública</li>
                                <li>Migración de categorías principales</li>
                                <li>Extracción y migración de subcategorías</li>
                                <li>Migración de productos (items)</li>
                              </ol>
                            </dd>
                          </div>
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Requisitos
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <ul className="list-disc pl-5 space-y-2">
                                <li>El archivo JSON debe existir en la ruta <code>/public/data/beverages.json</code></li>
                                <li>Tablas creadas en Supabase siguiendo el esquema relacional</li>
                                <li>Configuración correcta de Supabase en el proyecto</li>
                              </ul>
                            </dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Ayuda
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <p>
                                Si encuentras algún problema durante la migración, verifica los siguientes puntos:
                              </p>
                              <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Que el archivo JSON tenga el formato correcto</li>
                                <li>Que las tablas estén creadas en Supabase</li>
                                <li>Que tengas permisos de escritura en Supabase</li>
                                <li>Revisa los logs para identificar errores específicos</li>
                              </ul>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }