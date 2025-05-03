import { MetadataRoute } from 'next'
import { getAllPages } from '@/lib/api' // Using our JSON API

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ineditrestaurant.com';
  
  // Fetch all pages from our API
  const pages = await getAllPages()
  
  // Static routes that are not managed by our CMS
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/drinks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reservation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
  
  // Dynamic routes based on CMS pages
  const dynamicRoutes = pages
    .filter(page => 
      page.slug && 
      !staticRoutes.some(route => route.url === `${baseUrl}/${page.slug}`)
    )
    .map(page => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  
  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes]
}
