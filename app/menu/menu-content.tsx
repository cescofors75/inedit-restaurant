"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import Image from "next/image"

// Reutilizamos las mismas interfaces que funcionan en MenuPreview
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

interface MenuItem {
  id: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  price: string;
  categoryId: string; // En lugar de 'category'
  image?: string;
}

// Es un poco diferente, pero mantenemos la misma estructura básica
interface MenuCategory {
  id: string;
  name: MultiLanguageText;
  description?: MultiLanguageText;
  slug?: string;
}

interface MenuContentProps {
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
}

export default function MenuContent({ initialCategories, initialItems }: MenuContentProps) {
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)
  const [items, setItems] = useState<MenuItem[]>(initialItems)

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  // Filter items by active category
  const filteredItems = items.filter(item => 
    item.categoryId === activeCategory
  )

  return (
    <div className="pt-20 pb-16 bg-background">
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