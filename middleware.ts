import { NextResponse, type NextRequest } from 'next/server';

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
};

// Reverse mapping to convert localized routes back to internal routes
const reverseRouteMappings: Record<string, Record<string, string>> = {};
Object.entries(routeMappings).forEach(([lang, routes]) => {
  reverseRouteMappings[lang] = {};
  Object.entries(routes).forEach(([internal, localized]) => {
    reverseRouteMappings[lang][localized] = internal;
  });
});

// Supported languages
const supportedLanguages = ['es', 'en', 'ca', 'fr', 'it', 'de'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  
  // Get language from cookie or default to 'es'
  let language = request.cookies.get('language')?.value || 'es';
  
  // Validate language
  if (!supportedLanguages.includes(language)) {
    language = 'es';
  }
  
  // Check if we're on a localized route and need to redirect to internal route
  const localizedRoutes = reverseRouteMappings[language];
  if (localizedRoutes && localizedRoutes[pathname]) {
    const internalRoute = localizedRoutes[pathname];
    const url = request.nextUrl.clone();
    url.pathname = internalRoute;
    
    // Add language parameter to search params for internal handling
    url.searchParams.set('lang', language);
    
    return NextResponse.rewrite(url);
  }
  
  const response = NextResponse.next();
  
  // Set language cookie if not present
  if (!request.cookies.get('language')) {
    response.cookies.set('language', language, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  
  // Only apply cache changes in production environment
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

