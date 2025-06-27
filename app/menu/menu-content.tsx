"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import Image from "next/image"

// Define interfaces for menu data
interface MultiLanguageText {
  en: string;
  es: string;
  ca: string;
  fr: string;
  it: string;
  de: string;
 
  [key: string]: string;
}

interface MenuItem {
  id: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  price: string;
  categoryId: string;
  image?: string;
}

interface MenuCategory {
  id: string;
  name: MultiLanguageText;
  slug: string;
  description: MultiLanguageText;
}

interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
}

// MenuContent ahora cargará sus propios datos, similar a MenuPreview
export default function MenuContent() {
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch menu data when component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      
      try {
        // Fetch the JSON data
        const response = await fetch('/data/menu.json');
        const data: MenuData = await response.json();
        
        if (data && data.categories && data.items) {
          // Store the menu items and categories
          setMenuItems(data.items);
          setCategories(data.categories);
          
          // Set the first category as active if available
          if (data.categories.length > 0 && !activeCategory) {
            setActiveCategory(data.categories[0].id);
          }
        } else {
          console.error('Invalid menu data structure:', data);
        }
      } catch (err) {
        console.error('Error loading menu data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, [activeCategory]);

  // Filter items for the active category
  const filteredItems = menuItems.filter(item => 
    item.categoryId === activeCategory
  );

  if (loading) {
    return (
      <div className="pt-24 pb-16 bg-background">
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

  return (
    <div className="pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-4xl font-serif font-bold mb-4">{t("menu.title")}</h1>
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
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-md text-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-brand text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name[language] || category.name.en}
              </button>
            ))}
          </div>
       
         <div className="text-center mb-8">
            {categories.map((category) => (
              activeCategory === category.id && (
                <p key={category.id} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {category.description[language] || category.description.en}
                </p>
              )
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border mb-8 mt-2"></div>

          {/* Menu items */}
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-medium mb-2">
                        {item.name[language] || item.name.en}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description[language] || item.description.en}
                      </p>
                    </div>
                    <span className="text-brand font-medium text-lg ml-4">{item.price} €</span>
                  </div>
                  {item.image && (
                    <div className="mt-4">
                      <Image 
                        src={item.image}
                        alt={item.name[language] || item.name.en}
                        width={800}
                        height={600}
                        className="rounded-md object-cover max-h-48 w-auto mx-auto"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">{t("menu.no_items_in_category")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}