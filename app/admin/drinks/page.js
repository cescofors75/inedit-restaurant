'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase'; // Asegúrate de que la ruta sea correcta

export default function BeveragesAdmin() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [changingCategory, setChangingCategory] = useState(false);
  
  // Idiomas disponibles
  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'ca', name: 'Catalán' },
    { code: 'fr', name: 'Francés' },
    { code: 'it', name: 'Italiano' },
    { code: 'de', name: 'Alemán' },
    { code: 'ru', name: 'Ruso' }
  ];
  
  // Cargar datos desde Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('beverage_categories')
          .select('*')
          .order('id');
        
        if (categoriesError) throw categoriesError;
        
        // Obtener subcategorías
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from('beverage_subcategories')
          .select('*')
          .order('id');
        
        if (subcategoriesError) throw subcategoriesError;
        
        // Obtener items
        const { data: itemsData, error: itemsError } = await supabase
          .from('beverage_items')
          .select('*')
          .order('id');
        
        if (itemsError) throw itemsError;
        
        // Actualizar el estado con los datos obtenidos
        setCategories(categoriesData || []);
        setSubcategories(subcategoriesData || []);
        setItems(itemsData || []);
        
        // MODIFIED: Only set default category if no category is selected AND we're doing the initial load
        if (categoriesData && categoriesData.length > 0 && selectedCategory === null) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.message);
        
        // Si no hay datos, verificar si necesitamos crear datos iniciales
        if (err.code === 'PGRST116' || (categories.length === 0 && items.length === 0)) {
          await initializeData();
        }
      } finally {
        setLoading(false);
      }
    }
  
    
    // Función para inicializar datos si es necesario
    async function initializeData() {
      try {
        console.log("Inicializando datos...");
        
        // Crear categorías iniciales
        const initialCategories = [
          {
            id: "cocteles",
            name_en: "Cocktails",
            name_es: "Cócteles",
            name_ca: "Còctels",
            name_fr: "Cocktails",
            name_it: "Cocktail",
            name_de: "Cocktails",
            name_ru: "Коктейли",
            slug: "cocteles"
          },
          {
            id: "vinos",
            name_en: "Wines",
            name_es: "Vinos",
            name_ca: "Vins",
            name_fr: "Vins",
            name_it: "Vini",
            name_de: "Weine",
            name_ru: "Вина",
            slug: "vinos"
          },
          {
            id: "bebidas",
            name_en: "Drinks",
            name_es: "Bebidas",
            name_ca: "Begudes",
            name_fr: "Boissons",
            name_it: "Bevande",
            name_de: "Getränke",
            name_ru: "Напитки",
            slug: "bebidas"
          }
        ];
        
        // Crear subcategorías iniciales
        const initialSubcategories = [
          {
            id: "vino_tinto",
            category_id: "vinos",
            name: "Vino Tinto"
          },
          {
            id: "vino_blanco",
            category_id: "vinos",
            name: "Vino Blanco"
          },
          {
            id: "vino_rosado",
            category_id: "vinos",
            name: "Vino Rosado"
          }
        ];
        
        // Insertar categorías
        const { error: categoriesError } = await supabase
          .from('beverage_categories')
          .insert(initialCategories);
        
        if (categoriesError) {
          console.error('Error al insertar categorías:', categoriesError);
        } else {
          console.log('Categorías iniciales creadas');
        }
        
        // Insertar subcategorías
        const { error: subcategoriesError } = await supabase
          .from('beverage_subcategories')
          .insert(initialSubcategories);
        
        if (subcategoriesError) {
          console.error('Error al insertar subcategorías:', subcategoriesError);
        } else {
          console.log('Subcategorías iniciales creadas');
        }
        
        // Recargar datos
        setCategories(initialCategories);
        setSubcategories(initialSubcategories);
        setSelectedCategory(initialCategories[0].id);
      } catch (err) {
        console.error('Error al inicializar datos:', err);
        setError('Error al inicializar datos: ' + err.message);
      }
    }
    
    fetchData();
  }, []);
  
  
  
  // Obtener subcategorías para la categoría activa
  const getActiveSubcategories = () => {
    return subcategories.filter(subcat => subcat.category_id === selectedCategory);
  };
  
  // Funciones para manejar categorías
  const handleCategoryChange = (field, value) => {
    if (!editCategory) return;
    
    setEditCategory({
      ...editCategory,
      [field]: value
    });
  };
  
  const handleCategoryLanguageChange = (field_prefix, lang, value) => {
    if (!editCategory) return;
    
    const fieldName = `${field_prefix}_${lang}`;
    
    setEditCategory({
      ...editCategory,
      [fieldName]: value
    });
  };
  
  const addNewCategory = () => {
    const newCategory = {
      id: "",
      name_es: "Nueva Categoría",
      name_en: "New Category",
      name_ca: "Nova Categoria",
      name_fr: "Nouvelle Catégorie",
      name_it: "Nuova Categoria",
      name_de: "Neue Kategorie",
      name_ru: "Новая категория",
      slug: "nueva-categoria",
      description_es: "",
      description_en: "",
      description_ca: "",
      description_fr: "",
      description_it: "",
      description_de: "",
      description_ru: ""
    };
    
    setEditCategory(newCategory);
  };
  
  const updateCategory = async () => {
    if (!editCategory) return;
    
    try {
      setSaveLoading(true);
      
      if (!editCategory.id) {
        // Si es una nueva categoría, generar un ID único
        editCategory.id = editCategory.slug || uuidv4();
      }
      
      // Comprobar si la categoría ya existe
      const isNewCategory = !categories.some(cat => cat.id === editCategory.id);
      
      if (isNewCategory) {
        // Insertar nueva categoría
        const { error } = await supabase
          .from('beverage_categories')
          .insert([editCategory]);
        
        if (error) throw error;
        
        // Actualizar lista de categorías
        setCategories([...categories, editCategory]);
      } else {
        // Actualizar categoría existente
        const { error } = await supabase
          .from('beverage_categories')
          .update(editCategory)
          .eq('id', editCategory.id);
        
        if (error) throw error;
        
        // Actualizar lista de categorías
        setCategories(
          categories.map(cat => cat.id === editCategory.id ? editCategory : cat)
        );
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
  
  const deleteCategory = async (categoryId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Se eliminarán también todos los items asociados.')) {
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Eliminar items de esta categoría
      const { error: itemsError } = await supabase
        .from('beverage_items')
        .delete()
        .eq('category_id', categoryId);
      
      if (itemsError) throw itemsError;
      
      // Eliminar subcategorías de esta categoría
      const { error: subcategoriesError } = await supabase
        .from('beverage_subcategories')
        .delete()
        .eq('category_id', categoryId);
      
      if (subcategoriesError) throw subcategoriesError;
      
      // Eliminar la categoría
      const { error: categoryError } = await supabase
        .from('beverage_categories')
        .delete()
        .eq('id', categoryId);
      
      if (categoryError) throw categoryError;
      
      // Actualizar lista de categorías
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
      // Actualizar lista de items
      setItems(items.filter(item => item.category_id !== categoryId));
      
      // Actualizar lista de subcategorías
      setSubcategories(subcategories.filter(subcat => subcat.category_id !== categoryId));
      
      // Si eliminamos la categoría seleccionada, seleccionar otra
      if (selectedCategory === categoryId) {
        const firstCategory = categories.find(cat => cat.id !== categoryId);
        setSelectedCategory(firstCategory ? firstCategory.id : null);
      }
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert(`Error al eliminar categoría: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Funciones para manejar subcategorías
  const addNewSubcategory = () => {
    if (!selectedCategory) {
      alert('Por favor, selecciona una categoría primero');
      return;
    }
    
    const newSubcategory = {
      id: uuidv4(),
      category_id: selectedCategory,
      name: "Nueva Subcategoría"
    };
    
    // Insertar nueva subcategoría
    supabase
      .from('beverage_subcategories')
      .insert([newSubcategory])
      .then(({ error }) => {
        if (error) {
          console.error('Error al añadir subcategoría:', error);
          alert(`Error al añadir subcategoría: ${error.message}`);
          return;
        }
        
        // Actualizar lista de subcategorías
        setSubcategories([...subcategories, newSubcategory]);
      });
  };
  
  const deleteSubcategory = async (subcategoryId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) {
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Actualizar los items con esta subcategoría para quitársela
      const { error: itemsError } = await supabase
        .from('beverage_items')
        .update({ subcategory_id: null })
        .eq('subcategory_id', subcategoryId);
      
      if (itemsError) throw itemsError;
      
      // Eliminar la subcategoría
      const { error: subcatError } = await supabase
        .from('beverage_subcategories')
        .delete()
        .eq('id', subcategoryId);
      
      if (subcatError) throw subcatError;
      
      // Actualizar lista de subcategorías
      setSubcategories(subcategories.filter(subcat => subcat.id !== subcategoryId));
      
      // Actualizar lista de items
      setItems(items.map(item => {
        if (item.subcategory_id === subcategoryId) {
          return {...item, subcategory_id: null};
        }
        return item;
      }));
    } catch (err) {
      console.error('Error al eliminar subcategoría:', err);
      alert(`Error al eliminar subcategoría: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Funciones para manejar items
  const handleItemChange = (field, value) => {
    if (!editItem) return;
    
    setEditItem({
      ...editItem,
      [field]: value
    });
  };
  
  const handleItemLanguageChange = (field_prefix, lang, value) => {
    if (!editItem) return;
    
    const fieldName = `${field_prefix}_${lang}`;
    
    setEditItem({
      ...editItem,
      [fieldName]: value
    });
  };
  
  const addNewItem = () => {
    if (!selectedCategory) {
      alert('Por favor, selecciona una categoría primero');
      return;
    }
    
    const newItem = {
      id: "",
      name_es: "Nuevo Item",
      name_en: "New Item",
      name_ca: "Nou Item",
      name_fr: "Nouvel Item",
      name_it: "Nuovo Item",
      name_de: "Neues Item",
      name_ru: "Новый элемент",
      description_es: "",
      description_en: "",
      description_ca: "",
      description_fr: "",
      description_it: "",
      description_de: "",
      description_ru: "",
      price: 0,
      category_id: selectedCategory,
      region: "",
      grapes: ""
    };
    
    setEditItem(newItem);
  };
  
  const updateItem = async () => {
    if (!editItem) return;
    
    try {
      setSaveLoading(true);
      
      if (!editItem.id) {
        // Si es un nuevo item, generar un ID único
        editItem.id = uuidv4();
      }
      
      // Comprobar si el item ya existe
      const isNewItem = !items.some(item => item.id === editItem.id);
      
      if (isNewItem) {
        // Insertar nuevo item
        const { error } = await supabase
          .from('beverage_items')
          .insert([editItem]);
        
        if (error) throw error;
        
        // Actualizar lista de items
        setItems([...items, editItem]);
      } else {
        // Actualizar item existente
        const { error } = await supabase
          .from('beverage_items')
          .update(editItem)
          .eq('id', editItem.id);
        
        if (error) throw error;
        
        // Actualizar lista de items
        setItems(
          items.map(item => item.id === editItem.id ? editItem : item)
        );
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
  
  const deleteItem = async (itemId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este item?')) {
      return;
    }
    
    try {
      setSaveLoading(true);
      
      // Eliminar el item
      const { error } = await supabase
        .from('beverage_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Actualizar lista de items
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error al eliminar item:', err);
      alert(`Error al eliminar item: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Filtrar items por categoría
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category_id === selectedCategory)
    : items;
  
  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos de bebidas...</p>
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
            <h1 className="text-2xl font-bold">Administración (Supabase)</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = '/admin/menu'}
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Ir a Menú
              </button>
            </div>
          </div>
         
          {/* Gestión de Categorías */}
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
            
            {/* Edit Category Form */}
            {editCategory && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-4">
                  {categories.some(cat => cat.id === editCategory.id) ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID (para uso interno)
                    </label>
                    <input
                      type="text"
                      value={editCategory.id}
                      onChange={(e) => handleCategoryChange('id', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={categories.some(cat => cat.id === editCategory.id)}
                    />
                    <p className="mt-1 text-sm text-gray-500">No se puede cambiar para categorías existentes</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (para URLs)
                    </label>
                    <input
                      type="text"
                      value={editCategory.slug}
                      onChange={(e) => handleCategoryChange('slug', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-3">Nombres de la Categoría</h4>
                  {languages.map(lang => (
                    <div key={`catname-${lang.code}`} className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {lang.name}
                      </label>
                      <input
                        type="text"
                        value={editCategory[`name_${lang.code}`] || ''}
                        onChange={(e) => handleCategoryLanguageChange('name', lang.code, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-3">Descripciones de la Categoría</h4>
                  {languages.map(lang => (
                    <div key={`catdesc-${lang.code}`} className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {lang.name}
                      </label>
                      <textarea
                        value={editCategory[`description_${lang.code}`] || ''}
                        onChange={(e) => handleCategoryLanguageChange('description', lang.code, e.target.value)}
                        rows="2"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setEditCategory(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={updateCategory}
                    disabled={saveLoading}
                    className={`px-4 py-2 ${saveLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
                  >
                    {saveLoading ? 'Guardando...' : 'Guardar Categoría'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Categories Table */}
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
                      Número de Items
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No hay categorías. Haz clic en "Añadir Categoría" para crear una.
                      </td>
                    </tr>
                  ) : (
                    categories.map(category => {
                      const itemCount = items.filter(item => item.category_id === category.id).length;
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
                            {itemCount} items
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


<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Seleccionar Categoría 
  </label>
  <div className="flex">
    <select
      value={selectedCategory || ''}
      onChange={(e) => {
        const newCategory = e.target.value;
        // Simple state transition with animation
        setChangingCategory(true);
        setSelectedCategory(newCategory);
        // Short timeout to allow animation to complete
        setTimeout(() => setChangingCategory(false), 200);
      }}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      <option value="">Todas las categorías</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name_es || category.name_en || category.slug}
        </option>
      ))}
    </select>
    
  </div>
</div>
          {/* Gestión de Subcategorías */}
          {selectedCategory && (
            <div className="mb-8 border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Subcategorías</h2>
                <button
                  onClick={addNewSubcategory}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Añadir Subcategoría
                </button>
              </div>
              
              {/* Subcategories Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getActiveSubcategories().length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                          No hay subcategorías para esta categoría. Haz clic en "Añadir Subcategoría".
                        </td>
                      </tr>
                    ) : (
                      getActiveSubcategories().map(subcat => {
                        const subcatItemCount = items.filter(item => item.subcategory_id === subcat.id).length;
                        return (
                         
                          <tr key={subcat.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {subcat.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subcatItemCount} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  const newName = prompt('Nuevo nombre para la subcategoría', subcat.name);
                                  if (newName && newName.trim()) {
                                    const updatedSubcat = {...subcat, name: newName.trim()};
                                    supabase
                                      .from('beverage_subcategories')
                                      .update(updatedSubcat)
                                      .eq('id', subcat.id)
                                      .then(({ error }) => {
                                        if (error) {
                                          alert(`Error al actualizar: ${error.message}`);
                                          return;
                                        }
                                        setSubcategories(
                                          subcategories.map(sc => sc.id === subcat.id ? updatedSubcat : sc)
                                        );
                                      });
                                  }
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => deleteSubcategory(subcat.id)}
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
          )}

<div className="flex justify-between items-center mb-4">      
<h2 className="text-xl font-semibold">Items</h2>
<button
      onClick={addNewItem}
      className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Añadir Item
    </button>
</div>
          {/* Formulario de edición */}
          {editItem && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-medium mb-4">
                {items.some(item => item.id === editItem.id) ? 'Editar Item' : 'Nuevo Item'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={editItem.category_id}
                    onChange={(e) => handleItemChange('category_id', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {categories.map(category => (
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
                    value={editItem.price || 0}
                    onChange={(e) => handleItemChange('price', parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por Copa (opcional)
                  </label>
                  <input
                    type="number"
                    value={editItem.price_glass || ''}
                    onChange={(e) => handleItemChange('price_glass', e.target.value ? parseFloat(e.target.value) : null)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              {/* Subcategoría (si la categoría seleccionada tiene subcategorías) */}
              {getActiveSubcategories().length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoría
                  </label>
                  <select
                    value={editItem.subcategory_id || ''}
                    onChange={(e) => handleItemChange('subcategory_id', e.target.value || null)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Sin subcategoría</option>
                    {getActiveSubcategories().map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Región/D.O.
                  </label>
                  <input
                    type="text"
                    value={editItem.region || ''}
                    onChange={(e) => handleItemChange('region', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="D.O. RIOJA, D.O. EMPORDÀ, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uvas
                  </label>
                  <input
                    type="text"
                    value={editItem.grapes || ''}
                    onChange={(e) => handleItemChange('grapes', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Tempranillo, Garnatxa, etc."
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Nombres</h3>
                {languages.map(lang => (
                  <div key={`name-${lang.code}`} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang.name}
                    </label>
                    <input
                      type="text"
                      value={editItem[`name_${lang.code}`] || ''}
                      onChange={(e) => handleItemLanguageChange('name', lang.code, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Descripciones</h3>
                {languages.map(lang => (
                  <div key={`desc-${lang.code}`} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang.name}
                    </label>
                    <textarea
                      value={editItem[`description_${lang.code}`] || ''}
                      onChange={(e) => handleItemLanguageChange('description', lang.code, e.target.value)}
                      rows="2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={updateItem}
                  disabled={saveLoading}
                  className={`px-4 py-2 ${saveLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
                >
                  {saveLoading ? 'Guardando...' : 'Guardar Item'}
                </button>
              </div>
            </div>
          )}
          
     

{/* Lista de items con animación */}
<div className="overflow-x-auto">
  <div
    style={{ 
      opacity: changingCategory ? 0 : 1, 
      transition: 'opacity 0.15s ease-in-out' 
    }}
  >
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
            Subcategoría
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Región
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
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              No hay items en esta categoría. Usa el botón "Añadir Item" para crear uno.
            </td>
          </tr>
        ) : (
          filteredItems.map((item, index) => {
            const category = categories.find(cat => cat.id === item.category_id);
            const subcategory = subcategories.find(subcat => subcat.id === item.subcategory_id);
            return (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 animate-fadeIn delay-${Math.min(index, 9)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subcategory ? subcategory.name : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.region || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.price} €
                  {item.price_glass && ` / Copa: ${item.price_glass} €`}
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

{/* Estilos para las animaciones */}
<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    opacity: 0;
    animation: fadeIn 0.3s ease-in-out forwards;
  }
  /* Clases de retraso para animación escalonada */
  .delay-0 { animation-delay: 0s; }
  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.1s; }
  .delay-3 { animation-delay: 0.15s; }
  .delay-4 { animation-delay: 0.2s; }
  .delay-5 { animation-delay: 0.25s; }
  .delay-6 { animation-delay: 0.3s; }
  .delay-7 { animation-delay: 0.35s; }
  .delay-8 { animation-delay: 0.4s; }
  .delay-9 { animation-delay: 0.45s; }
`}</style>
        </div>
      </div>
    </div>
  );
}