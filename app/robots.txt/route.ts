import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ineditrestaurant.com';
  
  // Create robots.txt content based on environment
  const robotsTxt = process.env.NODE_ENV === 'production'
    ? `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`
    : `# Disallow all crawlers in non-production environments
User-agent: *
Disallow: /`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

