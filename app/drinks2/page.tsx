"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { supabase } from "@/lib/supabase"

// Define interfaces para los datos de bebidas
interface MultiLanguageText {
  en: string;
  es: string;
  ca: string;
  fr: string;
  it: string;
  de: string;
  ru: string;
  [key: string]: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
}

interface BeverageCategory {
  id: string;
  name_en: string;
  name_es: string;
  name_ca: string;
  name_fr: string;
  name_it: string;
  name_de: string;
  name_ru: string;
  slug: string | null;
  description_en: string | null;
  description_es: string | null;
  description_ca: string | null;
  description_fr: string | null;
  description_it: string | null;
  description_de: string | null;
  description_ru: string | null;
}

interface BeverageItem {
  id: string;
  name_en: string;
  name_es: string;
  name_ca: string;
  name_fr: string;
  name_it: string;
  name_de: string;
  name_ru: string;
  description_en: string | null;
  description_es: string | null;
  description_ca: string | null;
  description_fr: string | null;
  description_it: string | null;
  description_de: string | null;
  description_ru: string | null;
  price: number;
  price_glass?: number;
  price_shot?: number;
  category_id: string;
  subcategory_id?: string | null;
  region?: string | null;
  grapes?: string | null;
  image?: string | null;
}

export default function DrinksPage() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("cocteles");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  
  // Variables de estado para datos de bebidas
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [items, setItems] = useState<BeverageItem[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Nuevos estados para controlar las transiciones
  const [changingCategory, setChangingCategory] = useState(false);
  const [changingSubcategory, setChangingSubcategory] = useState(false);

  // Cargar datos de bebidas solo cuando se monta el componente, no al cambiar categorías
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setItems(itemsData);
        
        // Establecer la primera categoría como activa si está disponible
        if (categoriesData.length > 0) {
          const firstCategoryId = categoriesData[0].id;
          setActiveTab(firstCategoryId);
          
          // Si hay subcategorías para esta categoría, establecer la primera como activa
          const categorySubcats = subcategoriesData.filter(
            subcat => subcat.category_id === firstCategoryId
          );
          
          if (categorySubcats.length > 0) {
            setActiveSubcategory(categorySubcats[0].id);
          } else {
            setActiveSubcategory("");
          }
        }
      } catch (err) {
        console.error('Error loading beverage data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load beverage data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []); // Dependencia vacía para cargar una sola vez

  // Manejar cambio de pestaña con animación
  const handleTabChange = (categoryId: string) => {
    if (activeTab !== categoryId) {
      setChangingCategory(true);
      
      // Breve retraso para permitir la animación de salida
      setTimeout(() => {
        setActiveTab(categoryId);
        
        // Si la categoría tiene subcategorías, establecer la primera como activa
        const categorySubcats = subcategories.filter(
          subcat => subcat.category_id === categoryId
        );
        
        if (categorySubcats.length > 0) {
          setActiveSubcategory(categorySubcats[0].id);
        } else {
          setActiveSubcategory("");
        }
        
        // Permitir que los nuevos elementos aparezcan con una animación
        setTimeout(() => {
          setChangingCategory(false);
        }, 50);
      }, 150);
    }
  };

  // Manejar cambio de subcategoría con animación
  const handleSubcategoryChange = (subcategoryId: string) => {
    if (activeSubcategory !== subcategoryId) {
      setChangingSubcategory(true);
      
      // Breve retraso para permitir la animación de salida
      setTimeout(() => {
        setActiveSubcategory(subcategoryId);
        
        // Permitir que los nuevos elementos aparezcan con una animación
        setTimeout(() => {
          setChangingSubcategory(false);
        }, 50);
      }, 150);
    }
  };

  // Obtener la categoría activa actual
  const getActiveCategory = () => {
    return categories.find(cat => cat.id === activeTab) || null;
  };

  // Obtener subcategorías para la categoría activa
  const getActiveSubcategories = () => {
    return subcategories.filter(subcat => subcat.category_id === activeTab);
  };

  // Filtrar items basados en el término de búsqueda, categoría activa y subcategoría
  const filterItems = (items: BeverageItem[]) => {
    if (!items || items.length === 0) return [];
    
    // Primero filtrar por categoría
    let filteredItems = items.filter(item => item.category_id === activeTab);
    
    // Luego por subcategoría si está activa
    if (activeSubcategory) {
      filteredItems = filteredItems.filter(item => item.subcategory_id === activeSubcategory);
    }
    
    // Luego por término de búsqueda si está presente
    if (!searchTerm) return filteredItems;
    
    return filteredItems.filter(item => {
      const nameKey = `name_${language}` as keyof BeverageItem;
      const descKey = `description_${language}` as keyof BeverageItem;
      
      return (
        (item[nameKey] as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item[descKey] as string)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  // Obtener el nombre de la categoría seleccionada actualmente en el idioma activo
  const getActiveCategoryName = () => {
    const activeCategory = categories.find(cat => cat.id === activeTab);
    if (!activeCategory) return '';
    
    const nameKey = `name_${language}` as keyof BeverageCategory;
    return (activeCategory[nameKey] as string) || activeCategory.name_en;
  };

  // Obtener el nombre de la subcategoría seleccionada actualmente
  const getActiveSubcategoryName = () => {
    const activeSubcat = subcategories.find(subcat => subcat.id === activeSubcategory);
    return activeSubcat ? activeSubcat.name : '';
  };

  // Obtener el valor de un campo multilingüe
  const getLocalizedField = (item: BeverageItem, fieldPrefix: string): string => {
    const fieldKey = `${fieldPrefix}_${language}` as keyof BeverageItem;
    const defaultKey = `${fieldPrefix}_en` as keyof BeverageItem;
    return ((item[fieldKey] as string) || (item[defaultKey] as string) || '');
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Bebidas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cargando nuestra selección de bebidas...
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-t-brand border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Bebidas</h1>
          <p className="text-lg text-red-500 max-w-2xl mx-auto">
            Error al cargar las bebidas: {error}
          </p>
        </div>
        <div className="max-w-5xl mx-auto text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand text-white rounded-md font-medium"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-background">
      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {language === 'es' ? 'Bebidas' : 'Drinks'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'es' 
              ? 'Nuestra selección de bebidas para complementar la experiencia gastronómica.'
              : 'Our selection of drinks to complement your dining experience.'}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Botones de pestaña principales para categorías */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map(category => {
              const nameKey = `name_${language}` as keyof BeverageCategory;
              return (
                <button
                  key={category.id}
                  onClick={() => handleTabChange(category.id)}
                  className={`px-8 py-3 rounded-md text-lg transition-colors ${
                    activeTab === category.id ? "bg-brand text-white font-medium" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {(category[nameKey] as string) || category.name_en}
                </button>
              );
            })}
          </div>

          {/* Botones de subcategoría - mostrados si existen subcategorías para la categoría activa */}
          {getActiveSubcategories().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {getActiveSubcategories().map(subcat => (
                <button
                  key={subcat.id}
                  onClick={() => handleSubcategoryChange(subcat.id)}
                  className={`px-5 py-2 rounded-md text-sm transition-colors ${
                    activeSubcategory === subcat.id ? "bg-amber-600 text-white font-medium" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  {subcat.name}
                </button>
              ))}
            </div>
          )}

          {/* Separador */}
          <div className="w-full h-px bg-border mb-6 mt-2"></div>

          {/* Lista de items con animaciones */}
          <div className="space-y-6 mt-8">
            <h2 className="text-2xl font-serif font-medium mb-6 text-center">
              {activeSubcategory ? getActiveSubcategoryName() : getActiveCategoryName()}
            </h2>

            <div 
              className="min-h-[300px]" 
              style={{ 
                opacity: changingCategory || changingSubcategory ? 0 : 1, 
                transition: 'opacity 0.15s ease-in-out' 
              }}
            >
              {filterItems(items).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterItems(items).map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-lg shadow-sm overflow-hidden animate-fadeIn"
                      style={{ 
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0, 
                        animation: 'fadeIn 0.3s ease-in-out forwards',
                      }}
                    >
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <div>
                          <h3 className="text-lg font-serif font-medium break-words hyphens-auto">
                            {getLocalizedField(item, 'name')}
                          </h3>
                          <div className="text-sm text-muted-foreground mt-2">
                            {item.region && `${item.region} - `}{item.grapes}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-brand font-medium">{item.price}€</div>
                          {item.price_glass && (
                            <div className="text-sm text-muted-foreground">Copa: {item.price_glass}€</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Solo mostrar imagen para categorías de vino */}
                      {item.image && (item.category_id === "vinos" ) && (
                        <div className="mt-3 rounded-md overflow-hidden bg-gray-100" style={{height: "200px"}}>
                          <img
                            src={item.image}
                            alt={getLocalizedField(item, 'name')}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 animate-fadeIn">
                  <p className="text-lg text-muted-foreground">
                    {language === 'es' 
                      ? 'No se encontraron bebidas que coincidan con su búsqueda.'
                      : 'No drinks found matching your search.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}