'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase'; // Asegúrate de que la ruta sea correcta

export default function AdminMenu() {
  // Estados
  const [menuData, setMenuData] = useState({ categories: [], items: [] });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);
  
  // Cargar datos desde Supabase
  useEffect(() => {
    async function fetchMenuData() {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .order('id', { ascending: true });
        
        if (categoriesError) throw categoriesError;
        
        // Obtener items
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .order('id');
        
        if (itemsError) throw itemsError;
        
        // Actualizar el estado con los datos obtenidos
        setMenuData({
          categories: categoriesData || [],
          items: itemsData || []
        });
        
        // Seleccionar la primera categoría por defecto solo si no hay categoría seleccionada
        if (categoriesData && categoriesData.length > 0 && selectedCategory === null) {
          setSelectedCategory(categoriesData[0].id);
        }
        
        console.log(`Cargados ${categoriesData?.length || 0} categorías y ${itemsData?.length || 0} platos`);
      } catch (err) {
        console.error('Error al cargar datos del menú:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMenuData();
  }, []);
  
  // Función para añadir nueva categoría
  const addNewCategory = () => {
    const newCategory = {
      id: "",
      name_es: "Nueva Categoría",
      name_en: "New Category",
      name_ca: "Nova Categoria",
      slug: "nueva-categoria",
      order: menuData.categories.length
    };
    
    setEditCategory(newCategory);
  };
  
  // Función para guardar una categoría (nueva o editada)
  const saveCategory = async () => {
    if (!editCategory) return;
    
    try {
      setSaveLoading(true);
      
      if (!editCategory.id) {
        // Si es una nueva categoría, generar un ID
        editCategory.id = editCategory.slug || uuidv4();
      }
      
      // Comprobar si la categoría ya existe
      const isNewCategory = !menuData.categories.some(cat => cat.id === editCategory.id);
      
      if (isNewCategory) {
        // Insertar nueva categoría
        const { error } = await supabase
          .from('menu_categories')
          .insert([editCategory]);
        
        if (error) throw error;
        
        // Actualizar lista de categorías
        setMenuData(prevData => ({
          ...prevData,
          categories: [...prevData.categories, editCategory]
        }));
      } else {
        // Actualizar categoría existente
        const { error } = await supabase
          .from('menu_categories')
          .update(editCategory)
          .eq('id', editCategory.id);
        
        if (error) throw error;
        
        // Actualizar lista de categorías
        setMenuData(prevData => ({
          ...prevData,
          categories: prevData.categories.map(cat => 
            cat.id === editCategory.id ? editCategory : cat
          )
        }));
      }
      
      // Cerrar formulario de edición
      setEditCategory(null);
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      alert(`Error al guardar categoría: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Función para eliminar categoría
  const deleteCategory = async (categoryId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Se eliminarán también todos los items asociados.')) {
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Eliminar items de esta categoría
      const { error: itemsError } = await supabase
        .from('menu_items')
        .delete()
        .eq('category_id', categoryId);
      
      if (itemsError) throw itemsError;
      
      // Eliminar la categoría
      const { error: categoryError } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);
      
      if (categoryError) throw categoryError;
      
      // Actualizar lista de categorías e items
      setMenuData(prevData => ({
        categories: prevData.categories.filter(cat => cat.id !== categoryId),
        items: prevData.items.filter(item => item.category_id !== categoryId)
      }));
      
      // Si eliminamos la categoría seleccionada, seleccionar otra
      if (selectedCategory === categoryId) {
        const firstCategory = menuData.categories.find(cat => cat.id !== categoryId);
        setSelectedCategory(firstCategory ? firstCategory.id : null);
      }
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert(`Error al eliminar categoría: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Función para manejar cambios en los campos del item en edición
  const handleItemChange = (field, value) => {
    if (!editItem) return;
    
    setEditItem({
      ...editItem,
      [field]: value
    });
  };
  
  // Función para añadir un nuevo item
  const addNewItem = () => {
    if (!selectedCategory) {
      alert('Por favor, selecciona una categoría primero');
      return;
    }
    
    const newItem = {
      id: "",
      name_es: "Nuevo Plato",
      name_en: "New Dish",
      name_ca: "Nou Plat",
      description_es: "",
      description_en: "",
      description_ca: "",
      price: 0,
      category_id: selectedCategory
    };
    
    setEditItem(newItem);
  };
  
  // Función para guardar un item (nuevo o editado)
  const saveItem = async () => {
    if (!editItem) return;
    
    try {
      setSaveLoading(true);
      
      if (!editItem.id) {
        // Si es un nuevo item, generar un ID
        editItem.id = uuidv4();
      }
      
      // Comprobar si el item ya existe
      const isNewItem = !menuData.items.some(item => item.id === editItem.id);
      
      if (isNewItem) {
        // Insertar nuevo item
        const { error } = await supabase
          .from('menu_items')
          .insert([editItem]);
        
        if (error) throw error;
        
        // Actualizar lista de items
        setMenuData(prevData => ({
          ...prevData,
          items: [...prevData.items, editItem]
        }));
      } else {
        // Actualizar item existente
        const { error } = await supabase
          .from('menu_items')
          .update(editItem)
          .eq('id', editItem.id);
        
        if (error) throw error;
        
        // Actualizar lista de items
        setMenuData(prevData => ({
          ...prevData,
          items: prevData.items.map(item => 
            item.id === editItem.id ? editItem : item
          )
        }));
      }
      
      // Cerrar formulario de edición
      setEditItem(null);
    } catch (err) {
      console.error('Error al guardar item:', err);
      alert(`Error al guardar item: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Función para eliminar un item
  const deleteItem = async (itemId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plato?')) {
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Eliminar el item
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Actualizar lista de items
      setMenuData(prevData => ({
        ...prevData,
        items: prevData.items.filter(item => item.id !== itemId)
      }));
    } catch (err) {
      console.error('Error al eliminar item:', err);
      alert(`Error al eliminar item: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Función auxiliar para contar los items de una categoría
  const getItemCountForCategory = (categoryId) => {
    if (!menuData || !menuData.items) return 0;
    return menuData.items.filter(item => item.category_id === categoryId).length;
  };
  
  // Filtrar items por categoría seleccionada
  const filteredItems = selectedCategory 
    ? menuData.items.filter(item => item.category_id === selectedCategory)
    : menuData.items;
  
  if (loading && (!menuData.categories || menuData.categories.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del menú...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-lg w-full">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Administración del Menú</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = '/admin/beverages'}
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Ir a Bebidas
              </button>
            </div>
          </div>
          
          {/* Sección de Categorías */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
              <button
                onClick={addNewCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Añadir Categoría
              </button>
            </div>
            
            {/* Formulario de Edición de Categoría */}
            {editCategory && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-4">
                  {menuData.categories.some(cat => cat.id === editCategory.id) ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID (para uso interno)
                    </label>
                    <input
                      type="text"
                      value={editCategory.id || ''}
                      onChange={(e) => setEditCategory({...editCategory, id: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={menuData.categories.some(cat => cat.id === editCategory.id)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (para URLs)
                    </label>
                    <input
                      type="text"
                      value={editCategory.slug || ''}
                      onChange={(e) => setEditCategory({...editCategory, slug: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre en Español
                  </label>
                  <input
                    type="text"
                    value={editCategory.name_es || ''}
                   
                    onChange={(e) => setEditCategory({...editCategory, name_es: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre en Inglés
                  </label>
                  <input
                    type="text"
                    value={editCategory.name_en || ''}
                    onChange={(e) => setEditCategory({...editCategory, name_en: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre en Catalán
                  </label>
                  <input
                    type="text"
                    value={editCategory.name_ca || ''}
                    onChange={(e) => setEditCategory({...editCategory, name_ca: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setEditCategory(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveCategory}
                    disabled={saveLoading}
                    className={`px-4 py-2 ${saveLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
                  >
                    {saveLoading ? 'Guardando...' : 'Guardar Categoría'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Tabla de Categorías */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Platos
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuData.categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No hay categorías. Haz clic en "Añadir Categoría" para crear una.
                      </td>
                    </tr>
                  ) : (
                    menuData.categories.map(category => {
                      // Calcular el número de platos para esta categoría
                      const itemCount = getItemCountForCategory(category.id);
                      
                      return (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {category.name_es || 'Sin nombre en español'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {category.name_en || 'Sin nombre en inglés'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {itemCount} platos
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditCategory({...category})}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              disabled={saveLoading}
                              className={`text-red-600 ${saveLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-900'}`}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Selector de Categoría y Botón de Añadir Plato */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Categoría
            </label>
            <div className="flex">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Todas las categorías</option>
                {menuData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name_es || category.name_en || category.slug}
                  </option>
                ))}
              </select>
              <button
                onClick={addNewItem}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Añadir Plato
              </button>
            </div>
          </div>
          
          {/* Formulario de Edición de Item */}
          {editItem && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-medium mb-4">
                {menuData.items.some(item => item.id === editItem.id) ? 'Editar Plato' : 'Nuevo Plato'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={editItem.category_id || ''}
                    onChange={(e) => handleItemChange('category_id', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {menuData.categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name_es || category.name_en || category.slug}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editItem.price || 0}
                    onChange={(e) => handleItemChange('price', parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre en Español
                </label>
                <input
                  type="text"
                  value={editItem.name_es || ''}
                  onChange={(e) => handleItemChange('name_es', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre en Inglés
                </label>
                <input
                  type="text"
                  value={editItem.name_en || ''}
                  onChange={(e) => handleItemChange('name_en', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre en Catalán
                </label>
                <input
                  type="text"
                  value={editItem.name_ca || ''}
                  onChange={(e) => handleItemChange('name_ca', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción en Español
                </label>
                <textarea
                  value={editItem.description_es || ''}
                  onChange={(e) => handleItemChange('description_es', e.target.value)}
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción en Inglés
                </label>
                <textarea
                  value={editItem.description_en || ''}
                  onChange={(e) => handleItemChange('description_en', e.target.value)}
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción en Catalán
                </label>
                <textarea
                  value={editItem.description_ca || ''}
                  onChange={(e) => handleItemChange('description_ca', e.target.value)}
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveItem}
                  disabled={saveLoading}
                  className={`px-4 py-2 ${saveLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
                >
                  {saveLoading ? 'Guardando...' : 'Guardar Plato'}
                </button>
              </div>
            </div>
          )}
          
          {/* Listado de Platos */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategory 
                ? `Platos en categoría: ${menuData.categories.find(c => c.id === selectedCategory)?.name_es || selectedCategory}` 
                : 'Todos los Platos'}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No hay platos {selectedCategory ? 'en esta categoría' : ''}. 
                        {selectedCategory ? ' Usa el botón "Añadir Plato" para crear uno.' : ' Selecciona una categoría para añadir platos.'}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => {
                      const category = menuData.categories.find(cat => cat.id === item.category_id);
                      return (
                        <tr 
                          key={item.id} 
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {item.name_es || 'Sin nombre en español'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.name_en || 'Sin nombre en inglés'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category ? (category.name_es || category.name_en || category.slug) : 'Sin categoría'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="max-w-xs truncate">
                              {item.description_es || 'Sin descripción'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.price ? `${item.price} €` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditItem({...item})}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              disabled={saveLoading}
                              className={`text-red-600 ${saveLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-900'}`}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}