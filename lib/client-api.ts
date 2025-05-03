// lib/client-api.ts
// This file contains client-side API functions using fetch

/**
 * Fetch translations for a given locale
 */
export async function fetchTranslations(locale: string): Promise<Record<string, string>> {
  try {
    // Fetch translations from an API endpoint
    const response = await fetch(`/api/translations?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
}

/**
 * Fetch beverage categories
 */
export async function fetchBeverageCategories(locale: string = 'es') {
  try {
    const response = await fetch(`/api/beverages?type=categories&locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch beverage categories: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching beverage categories:', error);
    return [];
  }
}

/**
 * Fetch beverage items, optionally filtered by category
 */
export async function fetchBeverageItems(locale: string = 'es', categoryId?: string) {
  try {
    let url = `/api/beverages?type=items&locale=${locale}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch beverage items: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching beverage items:', error);
    return [];
  }
}

/**
 * Fetch all beverage data (categories and items)
 */
export async function fetchAllBeverageData(locale: string = 'es') {
  try {
    const response = await fetch(`/api/beverages?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch beverage data: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching all beverage data:', error);
    return { categories: [], items: [] };
  }
}
/**
 * Fetch a page by its slug
 */
export async function fetchPageBySlug(slug: string, locale: string = 'es') {
  try {
    const response = await fetch(`/api/pages?slug=${slug}&locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all pages
 */
export async function fetchAllPages(locale: string = 'es') {
  try {
    const response = await fetch(`/api/pages?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch menu categories
 */
export async function fetchMenuCategories(locale: string = 'es') {
  try {
    const response = await fetch(`/api/menu?type=categories&locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu categories: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
}

/**
 * Fetch menu items, optionally filtered by category
 */
export async function fetchMenuItems(locale: string = 'es', categoryId?: string) {
  try {
    let url = `/api/menu?type=items&locale=${locale}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

/**
 * Fetch gallery images
 */
export async function fetchGalleryImages(locale: string = 'es') {
  try {
    const response = await fetch(`/api/gallery?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gallery images: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

/**
 * Fetch restaurant settings
 */
export async function fetchRestaurantSettings(locale: string = 'es') {
  try {
    const response = await fetch(`/api/settings?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch restaurant settings: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    return null;
  }
}

