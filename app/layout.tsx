import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import LayoutWrapper from "@/components/layout-wrapper"
import { ThemeProvider } from "next-themes"
import { getPageBySlug } from "@/lib/api" // Using our JSON API

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch homepage SEO metadata from our API
    const homePage = await getPageBySlug('home', 'es')
    
    // If we have homepage data with SEO metadata, use it
    if (homePage && homePage.seo) {
      return {
        metadataBase: new URL("https://inedit-restaurant.com"),
        title: homePage.seo.title,
        description: homePage.seo.description,
        keywords: homePage.seo.keywords,
        openGraph: {
          title: homePage.seo.title,
          description: homePage.seo.description,
          images: [{
            url: "/images/og-default.jpg",
            alt: "INÈDIT Restaurant",
            width: 1200,
            height: 630,
          }],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: homePage.seo.title,
          description: homePage.seo.description,
          images: ["/images/og-default.jpg"],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  // Fallback metadata
  return {
    metadataBase: new URL("https://inedit-restaurant.com"),
    title: "INÈDIT | Signature Cuisine Restaurant",
    description: "Experience exclusive, creative, and modern fine dining at INÈDIT restaurant.",
    keywords: ["restaurant", "signature cuisine", "gourmet", "fine dining"],
    openGraph: {
      title: "INÈDIT | Signature Cuisine Restaurant",
      description: "Experience exclusive, creative, and modern fine dining at INÈDIT restaurant.",
      images: [{
        url: "/images/og-default.jpg",
        alt: "INÈDIT Restaurant",
        width: 1200,
        height: 630,
      }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "INÈDIT | Signature Cuisine Restaurant",
      description: "Experience exclusive, creative, and modern fine dining at INÈDIT restaurant.",
      images: ["/images/og-default.jpg"],
    },
  };
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-background text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
