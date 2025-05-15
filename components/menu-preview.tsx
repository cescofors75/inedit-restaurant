"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
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
  categoryId: string; // Usamos categoryId en lugar de category
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

export default function MenuPreview() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu data when component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      
      try {
        // Fetch the JSON data 
        const response = await fetch('/data/menuPreview.json');
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
  const activeItems = menuItems.filter(item => item.categoryId === activeCategory);

  // Get category name in current language
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return categoryId;
    return category.name[language] || category.name.en;
  };

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-8"></div>
              <div className="h-px bg-border mb-8 mt-2"></div>
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-muted pb-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("menu.title")}</h2>
          <p className="text-muted-foreground">{t("menu.no_items")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("menu.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("menu.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Category navigation */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
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

          {/* Divider */}
          <div className="w-full h-px bg-border mb-8 mt-2"></div>

          {/* Menu items */}
          <div className="space-y-6">
            {activeItems.length > 0 ? (
              activeItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 border-b border-muted pb-4"
                >
                  {/*item.image && (
                    <div className="flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name[language] || item.name.en}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )*/}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-medium text-lg">{item.name[language] || item.name.en}</h3>
                      <span className="text-brand font-medium">{item.price}€</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {item.description[language] || item.description.en}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">{t("menu.no_items_in_category")}</p>
            )}
          </div>
          <div className="mt-8 text-center">
  <Link href="/menu" className="bg-gray-200 rounded-md p-4 text-brand font-medium inline-block">
    {t("menu.view_full_menu")}
  </Link>
</div>
          
        </div>
      </div>
    </section>
  );
}