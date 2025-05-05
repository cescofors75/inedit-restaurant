// src/app/admin/beverages/page.js
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function BeveragesAdmin() {
  const [beverageData, setBeverageData] = useState({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  // Estados para edición
  const [editItem, setEditItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Changes for src/app/admin/beverages/page.js



// Add these new functions after the existing ones

// Handle category form changes
const handleCategoryChange = (field, value) => {
  if (!editCategory) return;
  
  setEditCategory({
    ...editCategory,
    [field]: value
  });
};

// Handle multilingual field changes for categories
const handleCategoryLanguageChange = (field, lang, value) => {
  if (!editCategory) return;
  
  setEditCategory({
    ...editCategory,
    [field]: {
      ...editCategory[field],
      [lang]: value
    }
  });
};

// Add new category
const addNewCategory = () => {
  const newCategory = {
    id: uuidv4(),
    name: {
      es: 'Nueva Categoría',
      en: 'New Category',
      ca: 'Nova Categoria',
      fr: 'Nouvelle Catégorie',
      it: 'Nuova Categoria',
      de: 'Neue Kategorie',
      ru: 'Новая категория'
    },
    slug: 'nueva-categoria',
    description: {
      es: '',
      en: '',
      ca: '',
      fr: '',
      it: '',
      de: '',
      ru: ''
    }
  };
  
  setEditCategory(newCategory);
};

// Update category
const updateCategory = () => {
  if (!editCategory) return;
  
  const updatedCategories = editCategory.id && beverageData.categories.some(cat => cat.id === editCategory.id)
    // Update existing category
    ? beverageData.categories.map(cat => cat.id === editCategory.id ? editCategory : cat)
    // Add new category
    : [...beverageData.categories, editCategory];
  
  setBeverageData({
    ...beverageData,
    categories: updatedCategories
  });
  
  setEditCategory(null);
};

// Delete category
const deleteCategory = (categoryId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta categoría? Se eliminarán también todos los vinos asociados.')) {
    // Remove all items with this category
    const updatedItems = beverageData.items.filter(item => item.categoryId !== categoryId);
    
    // Remove the category
    const updatedCategories = beverageData.categories.filter(cat => cat.id !== categoryId);
    
    setBeverageData({
      categories: updatedCategories,
      items: updatedItems
    });
    
    // If we deleted the selected category, reset selection
    if (selectedCategory === categoryId) {
      setSelectedCategory(updatedCategories.length > 0 ? updatedCategories[0].id : null);
    }
  }
};
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
  
  // Cargar datos iniciales
  useEffect(() => {
    async function fetchBeverages() {
      try {
        const response = await fetch('/api/drinks');
        if (!response.ok) {
          // Si el archivo no existe, intentar crearlo
          if (response.status === 404) {
            await initializeData();
            return;
          }
          throw new Error('Error al cargar los datos de bebidas');
        }
        const data = await response.json();
        setBeverageData(data);
        
        // Seleccionar la primera categoría por defecto
        if (data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.categories[0].id);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    // Inicializar datos si es necesario
    async function initializeData() {
      try {
        // Crear un archivo inicial con las categorías base para vinos
        const initialData = {
          categories: [
            {
              id: "escumosos",
              name: {
                "en": "Sparkling Wines",
                "es": "Vinos Espumosos",
                "ca": "Escumosos",
                "fr": "Vins Mousseux",
                "it": "Vini Spumanti",
                "de": "Schaumweine",
                "ru": "Игристые вина"
              },
              slug: "escumosos",
              description: {
                "en": "Our selection of sparkling wines",
                "es": "Nuestra selección de vinos espumosos",
                "ca": "La nostra selecció d'escumosos",
                "fr": "Notre sélection de vins mousseux",
                "it": "La nostra selezione di vini spumanti",
                "de": "Unsere Auswahl an Schaumweinen",
                "ru": "Наша коллекция игристых вин"
              }
            },
            {
              id: "blancs",
              name: {
                "en": "White Wines",
                "es": "Vinos Blancos",
                "ca": "Blancs",
                "fr": "Vins Blancs",
                "it": "Vini Bianchi",
                "de": "Weißweine",
                "ru": "Белые вина"
              },
              slug: "blancs",
              description: {
                "en": "Our selection of white wines",
                "es": "Nuestra selección de vinos blancos",
                "ca": "La nostra selecció de vins blancs",
                "fr": "Notre sélection de vins blancs",
                "it": "La nostra selezione di vini bianchi",
                "de": "Unsere Auswahl an Weißweinen",
                "ru": "Наша коллекция белых вин"
              }
            },
            {
              id: "negres",
              name: {
                "en": "Red Wines",
                "es": "Vinos Tintos",
                "ca": "Negres",
                "fr": "Vins Rouges",
                "it": "Vini Rossi",
                "de": "Rotweine",
                "ru": "Красные вина"
              },
              slug: "negres",
              description: {
                "en": "Our selection of red wines",
                "es": "Nuestra selección de vinos tintos",
                "ca": "La nostra selecció de vins negres",
                "fr": "Notre sélection de vins rouges",
                "it": "La nostra selezione di vini rossi",
                "de": "Unsere Auswahl an Rotweinen",
                "ru": "Наша коллекция красных вин"
              }
            },
            {
              id: "rosats",
              name: {
                "en": "Rosé Wines",
                "es": "Vinos Rosados",
                "ca": "Rosats",
                "fr": "Vins Rosés",
                "it": "Vini Rosati",
                "de": "Roséweine",
                "ru": "Розовые вина"
              },
              slug: "rosats",
              description: {
                "en": "Our selection of rosé wines",
                "es": "Nuestra selección de vinos rosados",
                "ca": "La nostra selecció de vins rosats",
                "fr": "Notre sélection de vins rosés",
                "it": "La nostra selezione di vini rosati",
                "de": "Unsere Auswahl an Roséweinen",
                "ru": "Наша коллекция розовых вин"
              }
            },
            {
              id: "dolcos",
              name: {
                "en": "Sweet Wines",
                "es": "Vinos Dulces",
                "ca": "Dolços",
                "fr": "Vins Doux",
                "it": "Vini Dolci",
                "de": "Süßweine",
                "ru": "Сладкие вина"
              },
              slug: "dolcos",
              description: {
                "en": "Our selection of sweet wines",
                "es": "Nuestra selección de vinos dulces",
                "ca": "La nostra selecció de vins dolços",
                "fr": "Notre sélection de vins doux",
                "it": "La nostra selezione di vini dolci",
                "de": "Unsere Auswahl an Süßweinen",
                "ru": "Наша коллекция сладких вин"
              }
            }
          ],
          items: []
        };
        
        // Intentar crear el archivo
        const createResponse = await fetch('/api/drinks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initialData),
        });
        
        if (!createResponse.ok) {
          throw new Error('Error al crear el archivo de bebidas');
        }
        
        setBeverageData(initialData);
        
        // Seleccionar la primera categoría por defecto
        setSelectedCategory(initialData.categories[0].id);
      } catch (err) {
        console.error('Error al inicializar datos:', err);
        setError('Error al inicializar datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBeverages();
  }, []);
  
  // Guardar cambios
  const saveData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/drinks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beverageData),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar las bebidas');
      }
      
      alert('Datos de bebidas guardados correctamente');
    } catch (err) {
      console.error('Error:', err);
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Añadir nueva bebida
  const addNewItem = () => {
    if (!selectedCategory) {
      alert('Por favor, selecciona una categoría primero');
      return;
    }
    
    const newItem = {
      id: uuidv4(),
      name: {
        es: 'Nuevo Vino',
        en: 'New Wine',
        ca: 'Nou Vi',
        fr: 'Nouveau Vin',
        it: 'Nuovo Vino',
        de: 'Neuer Wein',
        ru: 'Новое вино'
      },
      description: {
        es: '',
        en: '',
        ca: '',
        fr: '',
        it: '',
        de: '',
        ru: ''
      },
      price: '0',
      categoryId: selectedCategory,
      region: '',
      grapes: ''
    };
    
    setBeverageData({
      ...beverageData,
      items: [...beverageData.items, newItem]
    });
    
    setEditItem(newItem);
  };
  
  // Actualizar bebida
  const updateItem = () => {
    if (!editItem) return;
    
    setBeverageData({
      ...beverageData,
      items: beverageData.items.map(item => 
        item.id === editItem.id ? editItem : item
      )
    });
    
    setEditItem(null);
  };
  
  // Eliminar bebida
  const deleteItem = (itemId) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta bebida?')) {
      setBeverageData({
        ...beverageData,
        items: beverageData.items.filter(item => item.id !== itemId)
      });
    }
  };
  
  // Manejar cambios en el formulario de edición
  const handleItemChange = (field, value) => {
    if (!editItem) return;
    
    setEditItem({
      ...editItem,
      [field]: value
    });
  };
  
  // Manejar cambios en campos multilingües
  const handleLanguageChange = (field, lang, value) => {
    if (!editItem) return;
    
    setEditItem({
      ...editItem,
      [field]: {
        ...editItem[field],
        [lang]: value
      }
    });
  };
  
  // Filtrar bebidas por categoría
  const filteredItems = selectedCategory 
    ? beverageData.items.filter(item => item.categoryId === selectedCategory)
    : beverageData.items;
  
  if (loading && beverageData.categories.length === 0) {
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
            <h1 className="text-2xl font-bold">Administración de Vinos y Bebidas</h1>
            <div className="flex space-x-2">
              <button
                onClick={saveData}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                onClick={() => window.location.href = '/admin/food'}
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Ir a Platos
              </button>
            </div>
          </div>
         

{/* Gestión de Categorías */}
<div className="mb-8 border-b pb-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Gestión de Categorías de Vinos</h2>
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
        {beverageData.categories.some(cat => cat.id === editCategory.id) ? 'Editar Categoría' : 'Nueva Categoría'}
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
            disabled={beverageData.categories.some(cat => cat.id === editCategory.id)}
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
              value={editCategory.name[lang.code] || ''}
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
              value={editCategory.description[lang.code] || ''}
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Guardar Categoría
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
            Número de Vinos
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {beverageData.categories.length === 0 ? (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              No hay categorías. Haz clic en "Añadir Categoría" para crear una.
            </td>
          </tr>
        ) : (
          beverageData.categories.map(category => {
            const itemCount = beverageData.items.filter(item => item.categoryId === category.id).length;
            return (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {category.name.es || 'Sin nombre en español'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {category.name.en || 'Sin nombre en inglés'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {itemCount} vinos
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
                    className="text-red-600 hover:text-red-900"
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
          {/* Selector de categoría */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Categoría de Vinos
            </label>
            <div className="flex">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Todas las categorías</option>
                {beverageData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name.es || category.name.en || category.slug}
                  </option>
                ))}
              </select>
              <button
                onClick={addNewItem}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Añadir Vino
              </button>
            </div>
          </div>
          
          {/* Formulario de edición */}
          {editItem && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-medium mb-4">
                {editItem.id ? 'Editar Vino' : 'Nuevo Vino'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={editItem.categoryId}
                    onChange={(e) => handleItemChange('categoryId', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {beverageData.categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name.es || category.name.en || category.slug}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por Botella
                  </label>
                  <input
                    type="text"
                    value={editItem.price}
                    onChange={(e) => handleItemChange('price', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por Copa (opcional)
                  </label>
                  <input
                    type="text"
                    value={editItem.priceGlass || ''}
                    onChange={(e) => handleItemChange('priceGlass', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              
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
                      value={editItem.name[lang.code] || ''}
                      onChange={(e) => handleLanguageChange('name', lang.code, e.target.value)}
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
                      value={editItem.description[lang.code] || ''}
                      onChange={(e) => handleLanguageChange('description', lang.code, e.target.value)}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar Vino
                </button>
              </div>
            </div>
          )}
          
          {/* Lista de vinos */}
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
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No hay vinos en esta categoría. Usa el botón "Añadir Vino" para crear uno.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const category = beverageData.categories.find(cat => cat.id === item.categoryId);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {item.name.es || 'Sin nombre en español'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.name.en || 'Sin nombre en inglés'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category ? (category.name.es || category.name.en || category.slug) : 'Sin categoría'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.region || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.price} €
                          {item.priceGlass && ` / Copa: ${item.priceGlass} €`}
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
                            className="text-red-600 hover:text-red-900"
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
  );
}