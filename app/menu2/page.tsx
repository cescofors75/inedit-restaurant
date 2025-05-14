"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { supabase } from "@/lib/supabase"
import { Metadata } from "next"

// Esta función normalmente estaría en una página de nivel superior, pero aquí la incluimos como comentario
// export async function generateMetadata(): Promise<Metadata> {
//   return generatePageMetadata({ slug: 'menu2' });
// }

// Define interfaces for menu data from Supabase
interface MenuCategory {
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

interface MenuItem {
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
  category_id: string;
  image?: string | null;
}

export default function Menu2Page() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingCategory, setChangingCategory] = useState(false);

  // Fetch menu data from Supabase only on component mount, not when category changes
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .order('id');
        
        if (categoriesError) throw categoriesError;
        
        // Fetch menu items
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .order('id');
        
        if (itemsError) throw itemsError;
        
        // Update state with fetched data
        setCategories(categoriesData);
        setMenuItems(itemsData);
        
        // Set the first category as active if available and no active category is set
        if (categoriesData.length > 0 && !activeCategory) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (err) {
        console.error('Error loading menu data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, []); // Empty dependency array means this runs once on mount

  // Get localized field value (name, description, etc.)
  const getLocalizedField = (item: MenuCategory | MenuItem, fieldPrefix: string): string => {
    const fieldKey = `${fieldPrefix}_${language}` as keyof (MenuCategory | MenuItem);
    const defaultKey = `${fieldPrefix}_en` as keyof (MenuCategory | MenuItem);
    return ((item[fieldKey] as string) || (item[defaultKey] as string) || '');
  };

  // Filter items for the active category
  const filteredItems = menuItems.filter(item => 
    item.category_id === activeCategory
  );

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded w-24"></div>
              ))}
            </div>
            <div className="w-full h-px bg-gray-200 mb-8 mt-2"></div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse p-6 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{t("menu.title")}</h1>
            <p className="text-lg text-red-500 max-w-2xl mx-auto">
              {language === 'es' ? `Error al cargar el menú: ${error}` : `Error loading menu: ${error}`}
            </p>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand text-white rounded-md font-medium"
            >
              {language === 'es' ? 'Intentar de nuevo' : 'Try again'}
            </button>
          </div>
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
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{t("menu.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("menu.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  // Solo cambiamos si no estamos ya en esta categoría
                  if (activeCategory !== category.id) {
                    setChangingCategory(true);
                    // Breve retraso para permitir la animación de salida
                    setTimeout(() => {
                      setActiveCategory(category.id);
                      // Permitir que los nuevos elementos aparezcan con una animación
                      setTimeout(() => {
                        setChangingCategory(false);
                      }, 50);
                    }, 150);
                  }
                }}
                className={`px-6 py-3 rounded-md text-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-brand text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getLocalizedField(category, 'name')}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border mb-8 mt-2"></div>

          {/* Menu items with animation */}
          <div className="grid grid-cols-1 gap-6 min-h-[300px]" style={{ opacity: changingCategory ? 0 : 1, transition: 'opacity 0.15s ease-in-out' }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-white p-6 rounded-lg shadow-sm animate-fadeIn"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0, 
                    animation: 'fadeIn 0.3s ease-in-out forwards',
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-medium mb-2">
                        {getLocalizedField(item, 'name')}
                      </h3>
                      <p className="text-muted-foreground">
                        {getLocalizedField(item, 'description')}
                      </p>
                    </div>
                    <span className="text-brand font-medium text-lg ml-4">{item.price} €</span>
                  </div>
                  {/*item.image && (
                    <div className="mt-4">
                      <img 
                        src={item.image}
                        alt={getLocalizedField(item, 'name')}
                        className="rounded-md object-cover max-h-48 w-auto mx-auto"
                      />
                    </div>
                  )*/}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 animate-fadeIn">{t("menu.no_items_in_category")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}