import { getPageBySlug } from "@/lib/api"; // Changed from @/lib/contentful
import { Metadata } from "next";

interface PageMetadataProps {
  slug: string;
  locale?: string;
}

export async function generatePageMetadata({ 
  slug, 
  locale = 'es' 
}: PageMetadataProps): Promise<Metadata> {
  try {
    // Fetch page data from our JSON API
    const page = await getPageBySlug(slug, locale);
    
    if (page && page.seo) {
      // Our new JSON-based structure is simpler, so we'll provide basic metadata
      
      // Default structured data for restaurant
      const structuredData = slug === 'home' ? {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'INÈDIT Restaurant',
        url: 'https://ineditrestaurant.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Example Street 123',
          addressLocality: 'Barcelona',
          postalCode: '08001',
          addressCountry: 'ES',
        },
        telephone: '+34 932 123 456',
        priceRange: '€€€',
        servesCuisine: ['Mediterranean', 'Spanish', 'Signature Cuisine'],
        openingHours: [
          'Mo-Su 13:00-16:00', 
          'Mo-Su 19:00-23:00'
        ],
      } : undefined;
      
      // Return metadata object
      return {
        title: page.seo.title || page.title,
        description: page.seo.description,
        keywords: page.seo.keywords,
        openGraph: {
          title: page.seo.title || page.title,
          description: page.seo.description,
          images: [{
            url: "/images/og-default.jpg",
            alt: page.title,
            width: 1200,
            height: 630,
          }],
          type: 'website',
          siteName: 'INÈDIT Restaurant',
        },
        twitter: {
          card: "summary_large_image",
          title: page.seo.title || page.title,
          description: page.seo.description,
          images: ["/images/og-default.jpg"],
        },
        alternates: {
          languages: {
            'es': `/${slug}`,
            'en': `/${slug}?lang=en`,
            'ca': `/${slug}?lang=ca`,
          },
          canonical: `/${slug}`,
        },
        other: structuredData ? {
          'script:ld+json': JSON.stringify(structuredData),
        } : undefined,
      };
    }
  } catch (error) {
    console.error(`Error generating metadata for page ${slug}:`, error);
  }
  
  // Fallback metadata
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | INÈDIT Restaurant`,
    description: "Experience exclusive, creative, and modern fine dining at INÈDIT restaurant.",
    openGraph: {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | INÈDIT Restaurant`,
      description: "Experience exclusive, creative, and modern fine dining at INÈDIT restaurant.",
      images: [{
        url: "/images/og-default.jpg",
        alt: "INÈDIT Restaurant",
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | INÈDIT Restaurant`,
      description: "Experience exclusive, creative, and modern fine dining at INÈDIT restaurant.",
      images: ["/images/og-default.jpg"],
    },
  };
}

