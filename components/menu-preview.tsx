"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getMenuCategories, getMenuItems, type MenuCategory, type MenuItem } from "@/lib/contentful"
import Image from "next/image"

export default function MenuPreview() {
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("")
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true)
        // Fetch menu categories and items from Contentful
        const categories = await getMenuCategories(language)
        const items = await getMenuItems(language)
        
        setMenuCategories(categories)
        setMenuItems(items)
        
        // Set the first category as active by default if no category is selected yet
        if (categories.length > 0 && !activeCategory) {
          setActiveCategory(categories[0].id)
        }
      } catch (error) {
        console.error("Error fetching menu data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [language, activeCategory])

  // Filter items for the active category
  const activeItems = menuItems.filter(item => 
    item.category && item.category.sys && item.category.sys.id === activeCategory
  )

  // Find the active category object
  const activeCategoryObj = menuCategories.find(cat => cat.id === activeCategory)

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
    )
  }

  if (menuCategories.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("menu.title")}</h2>
          <p className="text-muted-foreground">{t("menu.no_items")}</p>
        </div>
      </section>
    )
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
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-md text-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-brand text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
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
                  {item.image && (
                    <div className="flex-shrink-0">
                      <Image 
                        src={`https:${item.image.fields.file.url}`} 
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-medium text-lg">{item.name}</h3>
                      <span className="text-brand font-medium">{item.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">{t("menu.no_items_in_category")}</p>
            )}
          </div>

          {/* View full menu link */}
          <div className="text-center mt-10">
            <Link 
              href="/menu" 
              className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-white font-medium hover:bg-brand/90 transition-colors"
            >
              {t("menu.view_full")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}