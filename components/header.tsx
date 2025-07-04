"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { useLocalizedRoutes } from "@/hooks/use-localized-routes"
import { Menu, X, Globe } from "lucide-react"
import { usePathname } from "next/navigation"
//import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { getLocalizedRoute, changeLanguageAndRoute } = useLocalizedRoutes()
  const pathname = usePathname()
  
  // Get current internal route from pathname
  const getCurrentInternalRoute = () => {
    const routeMappings = {
      es: { '/carta': '/menu', '/bebidas': '/drinks', '/galeria': '/gallery', '/contacto': '/contact', '/reserva': '/reservation' },
      ca: { '/menu': '/menu', '/begudes': '/drinks', '/galeria': '/gallery', '/contacte': '/contact', '/reserva': '/reservation' },
      fr: { '/menu': '/menu', '/boissons': '/drinks', '/galerie': '/gallery', '/contact': '/contact', '/reservation': '/reservation' },
      it: { '/menu': '/menu', '/bevande': '/drinks', '/galleria': '/gallery', '/contatti': '/contact', '/prenotazione': '/reservation' },
      de: { '/menu': '/menu', '/getranke': '/drinks', '/galerie': '/gallery', '/kontakt': '/contact', '/reservierung': '/reservation' },
      en: { '/menu': '/menu', '/drinks': '/drinks', '/gallery': '/gallery', '/contact': '/contact', '/reservation': '/reservation' }
    };
    
    const langRoutes = routeMappings[language as keyof typeof routeMappings];
    return langRoutes?.[pathname as keyof typeof langRoutes] || pathname;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen)
  }

  const changeLanguage = (lang: "en" | "es" | "ca" | "fr" | "it" | "de" ) => {
    const currentInternalRoute = getCurrentInternalRoute();
    changeLanguageAndRoute(lang, currentInternalRoute);
    setIsLanguageOpen(false);
  }

  const languageNames = {
    
    es: "Español",
    ca: "Català",
    fr: "Français",
    en: "English",
    it: "Italiano", 
    de: "Deutsch"
    
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/INeDIT_LOGO_Color.png"
              alt="INÈDIT Restaurant"
              width={240}
              height={80}
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-brand ${pathname === "/" ? "text-brand" : "text-primary"}`}
            >
              {t("nav.home")}
            </Link>
            <Link
              href={getLocalizedRoute('/menu')}
              className={`text-sm font-medium transition-colors hover:text-brand ${pathname === getLocalizedRoute('/menu') ? "text-brand" : "text-primary"}`}
            >
              {t("nav.menu")}
            </Link>
            <Link
              href={getLocalizedRoute('/drinks')}
              className={`text-sm font-medium transition-colors hover:text-brand ${pathname === getLocalizedRoute('/drinks') ? "text-brand" : "text-primary"}`}
            >
               {t("nav.drinks")}
            </Link>
            <Link
              href={getLocalizedRoute('/gallery')}
              className={`text-sm font-medium transition-colors hover:text-brand ${pathname === getLocalizedRoute('/gallery') ? "text-brand" : "text-primary"}`}
            >
              {t("nav.gallery")}
            </Link>
            <Link
              href={getLocalizedRoute('/contact')}
              className={`text-sm font-medium transition-colors hover:text-brand ${pathname === getLocalizedRoute('/contact') ? "text-brand" : "text-primary"}`}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle 
           <ThemeToggle />*/}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-sm font-medium text-primary hover:text-brand transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{language.toUpperCase()}</span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card text-card-foreground rounded-md shadow-lg py-1 z-50 border border-border">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code as "en" | "es" | "ca" | "fr" | "it" | "de" )}
                      className={`block w-full text-left px-4 py-2 text-sm ${language === code ? "text-brand font-medium" : "text-primary hover:bg-muted"}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book a Table Button */}
            <Link href={getLocalizedRoute('/reservation')} className="btn-primary">
              {t("hero.cta")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-primary hover:text-brand"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-brand hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href={getLocalizedRoute('/menu')}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-brand hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.menu")}
            </Link>
            <Link
              href={getLocalizedRoute('/drinks')}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-brand hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.drinks")}
            </Link>
            <Link
              href={getLocalizedRoute('/gallery')}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-brand hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.gallery")}
            </Link>
            <Link
              href={getLocalizedRoute('/contact')}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-brand hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-muted">

            {/* Language Selector Mobile */}
            <div className="px-3 py-2">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-primary">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code as "en" | "es" | "ca" | "fr" | "it" | "de")
                        setIsMenuOpen(false)
                      }}
                      className={`text-left px-3 py-2 rounded-md text-sm ${language === code ? "bg-brand text-white font-medium" : "text-primary hover:bg-muted"}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Book a Table Button Mobile */}
            <div className="px-3 py-2">
              <Link
                href={getLocalizedRoute('/reservation')}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-brand hover:bg-brand/90"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("hero.cta")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
