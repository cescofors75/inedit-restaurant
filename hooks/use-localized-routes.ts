"use client"

import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

// Route mappings for different languages
const routeMappings = {
  es: {
    '/menu': '/carta',
    '/drinks': '/bebidas',
    '/gallery': '/galeria',
    '/contact': '/contacto',
    '/reservation': '/reserva'
  },
  ca: {
    '/menu': '/menu',
    '/drinks': '/begudes',
    '/gallery': '/galeria',
    '/contact': '/contacte',
    '/reservation': '/reserva'
  },
  fr: {
    '/menu': '/menu',
    '/drinks': '/boissons',
    '/gallery': '/galerie',
    '/contact': '/contact',
    '/reservation': '/reservation'
  },
  it: {
    '/menu': '/menu',
    '/drinks': '/bevande',
    '/gallery': '/galleria',
    '/contact': '/contatti',
    '/reservation': '/prenotazione'
  },
  de: {
    '/menu': '/menu',
    '/drinks': '/getranke',
    '/gallery': '/galerie',
    '/contact': '/kontakt',
    '/reservation': '/reservierung'
  },
  en: {
    '/menu': '/menu',
    '/drinks': '/drinks',
    '/gallery': '/gallery',
    '/contact': '/contact',
    '/reservation': '/reservation'
  }
} as const;

export function useLocalizedRoutes() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

  // Get localized route for current language
  const getLocalizedRoute = useCallback((internalRoute: string): string => {
    const langRoutes = routeMappings[language as keyof typeof routeMappings]
    return langRoutes?.[internalRoute as keyof typeof langRoutes] || internalRoute
  }, [language])

  // Navigate to a localized route
  const navigateToRoute = useCallback((internalRoute: string) => {
    const localizedRoute = getLocalizedRoute(internalRoute)
    router.push(localizedRoute)
  }, [getLocalizedRoute, router])

  // Change language and redirect to corresponding page
  const changeLanguageAndRoute = useCallback((newLanguage: keyof typeof routeMappings, currentInternalRoute: string) => {
    // Set the new language in context (this will save to localStorage)
    setLanguage(newLanguage)
    
    // Set cookie for middleware
    document.cookie = `language=${newLanguage}; path=/; max-age=${60 * 60 * 24 * 365}`
    
    // Get the localized route for the new language
    const newLangRoutes = routeMappings[newLanguage]
    const localizedRoute = newLangRoutes?.[currentInternalRoute as keyof typeof newLangRoutes] || currentInternalRoute
    
    // Navigate to the new localized route
    router.push(localizedRoute)
  }, [setLanguage, router])

  return {
    getLocalizedRoute,
    navigateToRoute,
    changeLanguageAndRoute,
    routeMappings
  }
}
