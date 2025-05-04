"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Info */}
          <div className="flex flex-col items-start">
            <Image
              src="/images/INeDIT_LOGO_Color.png"
              alt="INÈDIT Restaurant"
              width={120}
              height={40}
              className="h-10 w-auto invert mb-4"
            />
            <p className="mt-2 text-sm text-gray-300 max-w-xs">
            {t("footer.description")}
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-300 hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                  <path d="M15 8h.01"></path>
                  <path d="M20 12a8 8 0 1 0-8 8"></path>
                  <path d="M9 15v-3"></path>
                  <path d="M13 15v-1"></path>
                  <path d="M17 15v-3a4 4 0 0 0-4-4h-2"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-medium mb-4">{t("location.title")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand mr-2 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Passeig Jacint Verdaguer, 9<br />
                  17310 Lloret de Mar
                  <br />
                  Girona, Spain
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-brand mr-2 mt-0.5" />
                <span className="text-sm text-gray-300">+34 972 365 245</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-brand mr-2 mt-0.5" />
                <span className="text-sm text-gray-300">inedit@ineditrestaurant.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-brand mr-2 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p>Monday - Sunday</p>
                  <p>13:00 - 16:00 / 19:00 - 23:00</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t("nav.menu")}
                </Link>
              </li>
              
              <li>
                <Link href="/drinks" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Cocktails & Drinks
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t("nav.gallery")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
             
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} INÈDIT. {t("footer.rights")}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
