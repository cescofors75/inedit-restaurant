"use client"

import { useState, useEffect } from "react"
import { fetchAllBeverageData } from "@/lib/client-api"
import { useLanguage } from "@/context/language-context"

// Define interfaces for beverage data
interface WineItem {
  id: string;
  name: string;
  region: string;
  price: string;
  glass?: boolean;
  note?: string;
}

interface WineCategory {
  id: string;
  label: string;
  wines: WineItem[];
}

interface CocktailItem {
  id: string;
  name: string;
  price: string;
}

interface CocktailCategory {
  id: string;
  category: string;
  items: CocktailItem[];
}

interface BeverageItem {
  id: string;
  name: string;
  price: string;
}

interface BeverageCategory {
  id: string;
  category: string;
  items: BeverageItem[];
}

interface SpiritItem {
  id: string;
  name: string;
  price: string;
}

interface SpiritCategory {
  id: string;
  category: string;
  items: SpiritItem[];
}

export default function DrinksPage() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("wine")
  const [activeWineCategory, setActiveWineCategory] = useState("sparkling")
  
  // Add state variables for beverage data
  const [wineCategories, setWineCategories] = useState<WineCategory[]>([])
  const [cocktails, setCocktails] = useState<CocktailCategory[]>([])
  const [beverages, setBeverages] = useState<BeverageCategory[]>([])
  const [spirits, setSpirits] = useState<SpiritCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch beverage data when component mounts or language changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchAllBeverageData(language);
        
        // Process and set the data to state
        if (data.categories && data.items) {
          // Process wines
          const wineData = data.categories.filter(cat => cat.type === 'wine') || [];
          setWineCategories(wineData.map(cat => ({
            id: cat.id,
            label: cat.name,
            wines: data.items.filter(item => item.categoryId === cat.id).map(item => ({
              id: item.id,
              name: item.name,
              region: item.region || '',
              price: item.price || '',
              glass: item.glass || false,
              note: item.description || ''
            }))
          })));
          
          // Process cocktails
          const cocktailCategories = data.categories.filter(cat => cat.type === 'cocktail') || [];
          setCocktails(cocktailCategories.map(cat => ({
            id: cat.id,
            category: cat.name,
            items: data.items.filter(item => item.categoryId === cat.id).map(item => ({
              id: item.id,
              name: item.name,
              price: item.price || ''
            }))
          })));
          
          // Process beverages
          const beverageCategories = data.categories.filter(cat => cat.type === 'beverage') || [];
          setBeverages(beverageCategories.map(cat => ({
            id: cat.id,
            category: cat.name,
            items: data.items.filter(item => item.categoryId === cat.id).map(item => ({
              id: item.id,
              name: item.name,
              price: item.price || ''
            }))
          })));
          
          // Process spirits
          const spiritCategories = data.categories.filter(cat => cat.type === 'spirit') || [];
          setSpirits(spiritCategories.map(cat => ({
            id: cat.id,
            category: cat.name,
            items: data.items.filter(item => item.categoryId === cat.id).map(item => ({
              id: item.id,
              name: item.name,
              price: item.price || ''
            }))
          })));
          
          // Set the first wine category as active if available
          if (wineData.length > 0 && wineData[0].id) {
            setActiveWineCategory(wineData[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching beverage data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load beverage data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [language]);
  const filterWines = (wines: WineItem[] = []) => {
    if (!wines || wines.length === 0) return [];
    if (!searchTerm) return wines;
    return wines.filter(
      (wine) =>
        wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wine.region && wine.region.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }

  // Find the active wine category
  const activeWineCategoryData =
    wineCategories.find((category) => category.id === activeWineCategory) || 
    (wineCategories.length > 0 ? wineCategories[0] : { id: '', label: '', wines: [] })

  return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Bebidas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Nuestra selección de vinos, cócteles y bebidas para complementar la experiencia gastronómica de INÈDIT.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Botones principales */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <button
              onClick={() => setActiveTab("wine")}
              className={`px-8 py-3 rounded-md text-lg transition-colors ${
                activeTab === "wine" ? "bg-brand text-white font-medium" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vinos
            </button>
            <button
              onClick={() => setActiveTab("cocktails")}
              className={`px-8 py-3 rounded-md text-lg transition-colors ${
                activeTab === "cocktails"
                  ? "bg-brand text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cócteles
            </button>
            <button
              onClick={() => setActiveTab("beverages")}
              className={`px-8 py-3 rounded-md text-lg transition-colors ${
                activeTab === "beverages"
                  ? "bg-brand text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Otras Bebidas
            </button>
          </div>

          {/* Contenido de Vinos */}
          {activeTab === "wine" && (
            <div>
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="text"
                  placeholder="Buscar por nombre o región..."
                  className="w-full p-3 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Botones de categorías de vino */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {wineCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveWineCategory(category.id)}
                    className={`px-6 py-3 rounded-md text-lg transition-colors ${
                      activeWineCategory === category.id
                        ? "bg-brand text-white font-medium"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Separador */}
              <div className="w-full h-px bg-border mb-6 mt-2"></div>

              {/* Lista de vinos */}
              <div className="space-y-6 mt-8">
                {filterWines(activeWineCategoryData?.wines || []).length > 0 ? (
                  filterWines(activeWineCategoryData?.wines || []).map((wine, index) => (
                    <div
                      key={index}
                      className={`bg-white p-5 rounded-lg shadow-sm overflow-hidden ${
                        index === 0 && activeWineCategory === "rose" ? "mt-8" : "mt-2"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <div>
                          <h3 className="text-lg font-serif font-medium break-words hyphens-auto">{wine.name}</h3>
                          <p className="text-sm font-medium text-muted-foreground mb-2">{wine.region}</p>
                          {wine.note && <p className="text-sm italic text-muted-foreground">{wine.note}</p>}
                        </div>
                        <div className="text-right">
                          {wine.price && <div className="text-brand font-medium">{wine.price}</div>}
                          {wine.glass && <div className="text-sm text-muted-foreground">Disponible por copa</div>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-muted-foreground">
                      No se encontraron vinos que coincidan con su búsqueda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contenido de Cócteles */}
          {activeTab === "cocktails" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cocktails.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-serif font-medium mb-4">{section.category}</h2>
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.price && <span className="text-brand">{item.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contenido de Otras Bebidas */}
          {activeTab === "beverages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {beverages.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-serif font-medium mb-4">{section.category}</h2>
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.price && <span className="text-brand">{item.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-serif font-medium mb-4">Destilados y Licores</h2>
                <div className="space-y-6">
                  {spirits.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-4">
                      <h3 className="text-xl font-medium mb-2">{section.category}</h3>
                      <div className="space-y-2">
                        {section.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-1">
                            <p>{item.name}</p>
                            {item.price && <span className="text-brand">{item.price}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
