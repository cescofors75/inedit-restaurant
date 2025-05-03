export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ineditrestaurant.com';

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

