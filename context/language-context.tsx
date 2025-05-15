"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchTranslations } from "@/lib/client-api" // Using client-safe API

export type Language = "es" | "en" | "ca" | "fr" | "it" | "de"  // Supporting all languages

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Function to load translations
  const loadTranslations = async (lang: Language) => {
    setIsLoading(true)
    try {
      const translationData = await fetchTranslations(lang)
      setTranslations(translationData)
    } catch (error) {
      console.error("Error loading translations:", error)
      // Fallback to empty translations object
      setTranslations({})
    } finally {
      setIsLoading(false)
    }
  }

  // Load translations when component mounts
  useEffect(() => {
    // Check if language is already set in localStorage
    const savedLanguage = typeof window !== 'undefined' 
      ? localStorage.getItem("language") as Language || "es"
      : "es"
    
    // Set language from localStorage or use default
    if (savedLanguage) {
      setLanguage(savedLanguage as Language)
    }
    
    // Load translations for the current language
    loadTranslations(savedLanguage)
  }, [])

  // Update localStorage and load new translations when language changes
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", lang)
    }
    loadTranslations(lang)
  }

  // Translation function
  const t = (key: string) => {
    return translations[key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleLanguageChange,
        t,
      }}
    >
      {isLoading && Object.keys(translations).length === 0 ? (
        <div className="flex items-center justify-center fixed inset-0">
          <div className="w-12 h-12 border-4 border-t-brand border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
