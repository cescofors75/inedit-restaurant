import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Only apply these changes in production environment
  if (process.env.NODE_ENV === 'production') {
    // Remove noindex header to allow search engines to index the site
    response.headers.delete('x-robots-tag');
    
    // Add robots header to explicitly allow indexing
    response.headers.set('x-robots-tag', 'index, follow');
    
    // Add cache control headers for static assets
    if (
      request.nextUrl.pathname.startsWith('/images/') ||
      request.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|ico|svg)$/)
    ) {
      // Long cache for images and other static assets
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      );
    } else if (
      request.nextUrl.pathname.match(/\.(js|css)$/)
    ) {
      // Long cache for JS and CSS with immutable flag
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      );
    } else if (request.nextUrl.pathname === '/') {
      // Homepage - shorter cache time to allow updates to propagate faster
      response.headers.set(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400'
      );
    } else {
      // Default caching for other pages
      response.headers.set(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400'
      );
    }
  }
  
  return response;
}

// Only run middleware on relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};

