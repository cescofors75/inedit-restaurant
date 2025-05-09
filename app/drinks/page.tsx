"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"

// Define interfaces for beverage data
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
  name: MultiLanguageText;
}

interface BeverageCategory {
  id: string;
  name: MultiLanguageText;
  slug: string;
  description: MultiLanguageText;
  subcategories?: Subcategory[];
}

interface BeverageItem {
  id: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  price: string;
  categoryId: string;
  subcategoryId?: string;
  image?: string;
  region?: string;
  grapes?: string;
}

export default function DrinksPage() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("cocteles");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  
  // Add state variables for beverage data
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [items, setItems] = useState<BeverageItem[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch beverage data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // For testing, we'll load it directly from the structure
        const response = await fetch('/data/beverages.json');
        const data = await response.json();
        
        if (data && data.categories && data.items) {
          setCategories(data.categories);
          setItems(data.items);
          
          // Extract subcategories from items for each category
          const extractedSubcategories: Record<string, Subcategory[]> = {};
          
          // For each category, collect unique subcategories from items
          data.categories.forEach((category: BeverageCategory) => {
            // Filter items for this category
            const categoryItems = data.items.filter((item: BeverageItem) => 
              item.categoryId === category.id
            );
            
            // Extract unique subcategory IDs
            const uniqueSubcatIds = Array.from(
              new Set(
                categoryItems
                  .filter((item: BeverageItem) => item.subcategoryId)
                  .map((item: BeverageItem) => item.subcategoryId)
              )
            );
            
            // Create subcategory objects
            if (uniqueSubcatIds.length > 0) {
              extractedSubcategories[category.id] = uniqueSubcatIds.map((id) => {
                // Find the first item with this subcategoryId to get its name
                const sampleItem = categoryItems.find((item: { subcategoryId: unknown; }) => item.subcategoryId === id);
                return {
                  id: id as string,
                  name: {
                    en: id as string,
                    es: id as string,
                    ca: id as string,
                    fr: id as string,
                    it: id as string,
                    de: id as string,
                    ru: id as string
                  }
                };
              });
            }
          });
          
          setSubcategories(extractedSubcategories);
          
          // Set the first category as active if available
          if (data.categories.length > 0) {
            const firstCategoryId = data.categories[0].id;
            setActiveTab(firstCategoryId);
            
            // If there are subcategories for this category, set the first one as active
            if (extractedSubcategories[firstCategoryId]?.length > 0) {
              setActiveSubcategory(extractedSubcategories[firstCategoryId][0].id);
            } else {
              setActiveSubcategory("");
            }
          }
        } else {
          console.error('Invalid data structure received:', data);
          setError('Data structure is invalid');
        }
      } catch (err) {
        console.error('Error loading beverage data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load beverage data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (categoryId: string) => {
    setActiveTab(categoryId);
    
    // If the category has subcategories, set the first one as active
    if (subcategories[categoryId]?.length > 0) {
      setActiveSubcategory(subcategories[categoryId][0].id);
    } else {
      setActiveSubcategory("");
    }
  };

  // Get the current active category
  const getActiveCategory = () => {
    return categories.find(cat => cat.id === activeTab) || null;
  };

  // Get subcategories for active category
  const getActiveSubcategories = () => {
    return subcategories[activeTab] || [];
  };

  // Filter items based on search term, active category and subcategory
  const filterItems = (items: BeverageItem[]) => {
    if (!items || items.length === 0) return [];
    
    // First filter by category
    let filteredItems = items.filter(item => item.categoryId === activeTab);
    
    // Then by subcategory if active
    if (activeSubcategory) {
      filteredItems = filteredItems.filter(item => item.subcategoryId === activeSubcategory);
    }
    
    // Then by search term if present
    if (!searchTerm) return filteredItems;
    
    return filteredItems.filter(item => 
      item.name[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description[language]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get the currently selected category name in the active language
  const getActiveCategoryName = () => {
    const activeCategory = categories.find(cat => cat.id === activeTab);
    return activeCategory?.name[language] || '';
  };

  // Get the currently selected subcategory name in the active language
  const getActiveSubcategoryName = () => {
    return activeSubcategory || '';
  };

  // Loading state
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

  // Error state
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
          {/* Main tab buttons for categories */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                className={`px-8 py-3 rounded-md text-lg transition-colors ${
                  activeTab === category.id ? "bg-brand text-white font-medium" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name[language] || category.name.en}
              </button>
            ))}
          </div>

          {/* Subcategory buttons - shown if subcategories exist for active category */}
          {getActiveSubcategories().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {getActiveSubcategories().map(subcat => (
                <button
                  key={subcat.id}
                  onClick={() => setActiveSubcategory(subcat.id)}
                  className={`px-5 py-2 rounded-md text-sm transition-colors ${
                    activeSubcategory === subcat.id ? "bg-amber-600 text-white font-medium" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  }`}
                >
                  {subcat.id}
                </button>
              ))}
            </div>
          )}

          {/* Separator */}
          <div className="w-full h-px bg-border mb-6 mt-2"></div>

          {/* Items list */}
          <div className="space-y-6 mt-8">
            <h2 className="text-2xl font-serif font-medium mb-6 text-center">
              {activeSubcategory ? getActiveSubcategoryName() : getActiveCategoryName()}
            </h2>

            {filterItems(items).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterItems(items).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div>
                        <h3 className="text-lg font-serif font-medium break-words hyphens-auto">
                          {item.name[language] || item.name.en}
                        </h3>
                        {/*<p className="text-sm text-muted-foreground mt-1">
                          {item.description[language] || item.description.en}
                        </p>*/}
                     
                        <div className="text-sm text-muted-foreground mt-2">
                          {item.region && `${item.region} - `}{item.grapes}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-brand font-medium">{item.price}€</div>
                      </div>
                    </div>
                    
                    {/* Only show image for wine categories */}
                    {item.image && (item.categoryId === "vinos" ) && (
                      <div className="mt-3 rounded-md overflow-hidden bg-gray-100" style={{height: "200px"}}>
                        <img
                          src={item.image}
                          alt={item.name[language]}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
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
  );
}