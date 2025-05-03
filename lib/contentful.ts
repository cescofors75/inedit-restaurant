import { createClient, ContentfulClientApi, Entry, EntryCollection } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';
import type { Document } from '@contentful/rich-text-types';

// Environment variable validation
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Validation flags
const hasValidCredentials = Boolean(spaceId && accessToken);
const hasManagementCredentials = Boolean(spaceId && managementToken);

// Warning message for missing credentials
if (!hasValidCredentials && isDev) {
  console.warn(
    '\x1b[33m%s\x1b[0m', // Yellow text for warning
    'Contentful credentials are missing or invalid. ' +
    'Make sure to set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in your .env.local file. ' +
    'Using mock data for development.'
  );
}

// Mock data for development
const mockPages = [
  {
    sys: {
      id: 'home-page-id',
      updatedAt: new Date().toISOString(),
    },
    fields: {
      title: 'Home',
      slug: 'home',
      content: {
        // Mock rich text content
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Welcome to INÈDIT Restaurant',
                marks: [],
                data: {}
              }
            ]
          }
        ]
      },
      seo: {
        title: 'INÈDIT | Signature Cuisine Restaurant',
        description: 'Experience exceptional signature cuisine in a unique atmosphere',
        keywords: ['restaurant', 'signature cuisine', 'gourmet', 'fine dining']
      }
    }
  },
  {
    sys: {
      id: 'menu-page-id',
      updatedAt: new Date().toISOString(),
    },
    fields: {
      title: 'Our Menu',
      slug: 'menu',
      content: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Discover our seasonal menu',
                marks: [],
                data: {}
              }
            ]
          }
        ]
      },
      seo: {
        title: 'Menu | INÈDIT Restaurant',
        description: 'Explore our seasonal and signature dishes',
        keywords: ['menu', 'food', 'cuisine', 'dishes']
      }
    }
  }
];

// Mock menu categories
const mockMenuCategories = [
  {
    sys: { id: 'starters-id' },
    fields: {
      name: 'Starters',
      slug: 'starters',
      description: 'Begin your culinary journey'
    }
  },
  {
    sys: { id: 'mains-id' },
    fields: {
      name: 'Main Courses',
      slug: 'mains',
      description: 'Signature dishes'
    }
  },
  {
    sys: { id: 'desserts-id' },
    fields: {
      name: 'Desserts',
      slug: 'desserts',
      description: 'Sweet endings'
    }
  }
];

// Mock menu items
const mockMenuItems = [
  {
    sys: { id: 'item1-id' },
    fields: {
      name: 'Tuna Tataki',
      description: 'Lightly seared tuna with sesame crust',
      price: '18',
      category: { sys: { id: 'starters-id' } }
    }
  },
  {
    sys: { id: 'item2-id' },
    fields: {
      name: 'Iberian Pork',
      description: 'With potato purée and seasonal vegetables',
      price: '24',
      category: { sys: { id: 'mains-id' } }
    }
  },
  {
    sys: { id: 'item3-id' },
    fields: {
      name: 'Chocolate Soufflé',
      description: 'With vanilla ice cream',
      price: '12',
      category: { sys: { id: 'desserts-id' } }
    }
  }
];

// Mock gallery images
const mockGalleryImages = [
  {
    sys: { id: 'gallery1-id', updatedAt: new Date().toISOString() },
    fields: {
      title: 'Restaurant Interior',
      description: 'The elegant dining room',
      image: {
        fields: {
          file: {
            url: '/images/mock/restaurant-interior.jpg',
            details: {
              image: {
                width: 1200,
                height: 800
              }
            }
          }
        }
      }
    }
  },
  {
    sys: { id: 'gallery2-id', updatedAt: new Date().toISOString() },
    fields: {
      title: 'Signature Dish',
      description: 'Our chef\'s special creation',
      image: {
        fields: {
          file: {
            url: '/images/mock/signature-dish.jpg',
            details: {
              image: {
                width: 1200,
                height: 800
              }
            }
          }
        }
      }
    }
  }
];

// Mock settings
const mockSettings = {
  sys: { id: 'settings-id', updatedAt: new Date().toISOString() },
  fields: {
    name: { 'es': 'INÈDIT Restaurant' },
    description: { 'es': 'Cocina de autor en un ambiente único' },
    contactInfo: {
      'es': {
        address: 'Calle Ejemplo 123, 08001 Barcelona',
        phone: '+34 123 456 789',
        email: 'info@inedit-restaurant.com'
      }
    },
    openingHours: {
      'es': {
        monday: { open: '12:00', close: '23:00', closed: false },
        tuesday: { open: '12:00', close: '23:00', closed: false },
        wednesday: { open: '12:00', close: '23:00', closed: false },
        thursday: { open: '12:00', close: '23:00', closed: false },
        friday: { open: '12:00', close: '00:00', closed: false },
        saturday: { open: '12:00', close: '00:00', closed: false },
        sunday: { open: '12:00', close: '22:00', closed: false }
      }
    },
    socialMedia: {
      'es': {
        instagram: 'https://instagram.com/inedit',
        facebook: 'https://facebook.com/inedit',
        twitter: 'https://twitter.com/inedit'
      }
    }
  }
};

// Mock translations
const mockTranslations = {
  'es': {
    'common.welcome': 'Bienvenido',
    'common.book_table': 'Reservar Mesa',
    'menu.title': 'Nuestra Carta',
    'contact.address': 'Dirección',
    'contact.phone': 'Teléfono',
    'contact.email': 'Email'
  },
  'en': {
    'common.welcome': 'Welcome',
    'common.book_table': 'Book a Table',
    'menu.title': 'Our Menu',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email'
  }
};

// Mock client for development when credentials are not available
const createMockClient = (): ContentfulClientApi => {
  return {
    getEntries: async (query: any) => {
      console.log('Mock getEntries called with query:', query);
      
      // Return mock pages
      if (query.content_type === 'page') {
        let items = [...mockPages];
        
        // Filter by slug if provided
        if (query['fields.slug']) {
          items = items.filter(page => page.fields.slug === query['fields.slug']);
        }
        
        return {
          items,
          total: items.length,
          skip: 0,
          limit: items.length
        };
      }
      
      // Return mock menu categories
      if (query.content_type === 'menuCategory') {
        return {
          items: mockMenuCategories,
          total: mockMenuCategories.length,
          skip: 0,
          limit: mockMenuCategories.length
        };
      }
      
      // Return mock menu items
      if (query.content_type === 'menuItem') {
        return {
          items: mockMenuItems,
          total: mockMenuItems.length,
          skip: 0,
          limit: mockMenuItems.length
        };
      }
      
      // Return mock gallery images
      if (query.content_type === 'galleryImage') {
        return {
          items: mockGalleryImages,
          total: mockGalleryImages.length,
          skip: 0,
          limit: mockGalleryImages.length
        };
      }
      
      // Default empty response
      return { items: [], total: 0, skip: 0, limit: 0 };
    },
    
    getEntry: async (id: string) => {
      // Return mock data based on id
      if (id === 'settings-id') {
        return mockSettings as any;
      }
      
      // Default response
      return { sys: { id: 'mock-id' }, fields: {} } as Entry<any>;
    },
    
    getSpace: async () => {
      return {
        getEnvironment: async () => {
          return {
            getEntries: async (query: any) => {
              if (query.content_type === 'restaurantSettings') {
                return { items: [mockSettings] };
              }
              
              if (query.content_type === 'translation') {
                const locale = query.locale || 'es';
                const translations = mockTranslations[locale] || {};
                
                return {
                  items: Object.entries(translations).map(([key, value]) => ({
                    fields: {
                      key: key,
                      value: value
                    }
                  }))
                };
              }
              
              return { items: [] };
            }
          };
        }
      } as any;
    },
    
    // Implement other required methods with mock returns
    getAsset: async () => ({ sys: { id: 'mock-id' }, fields: {} } as Entry<any>),
    getContentType: async () => ({ sys: { id: 'mock-id' }, fields: {} } as any),
    getContentTypes: async () => ({ items: [] } as any),
    getLocales: async () => ({ items: [{ code: 'en-US', default: true }] } as any),
    parseEntries: async (data) => data as any,
    sync: async () => ({ entries: [], assets: [], deletedEntries: [], deletedAssets: [] } as any),
  } as ContentfulClientApi;
};

// Create the actual client or a mock client depending on the environment
const client = hasValidCredentials
  ? createClient({
      space: spaceId!,
      accessToken: accessToken!,
      environment,
    })
  : createMockClient();

// Helper function to handle API calls with better error messages
const safeContentfulApiCall = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string,
  defaultValue: T
): Promise<T> => {
  if (!hasValidCredentials) {
    console.warn(
      '\x1b[33m%s\x1b[0m', // Yellow text for warning
      'Attempted to fetch Contentful data without valid credentials. ' +
      'Make sure to set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in your .env.local file. ' +
      'Returning mock data.'
    );
    return defaultValue;
  }

  try {
    return await apiCall();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return defaultValue;
  }
};

// Define common types for our Contentful data
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph?: {
    title: string;
    description: string;
    image?: {
      url: string;
      width: number;
      height: number;
      alt?: string;
    };
  };
  twitterCard?: {
    cardType: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image?: {
      url: string;
    };
  };
  structuredData?: {
    restaurantName?: string;
    restaurantUrl?: string;
    telephone?: string;
    priceRange?: string;
    servesCuisine?: string[];
    openingHours?: string[];
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: Document;
  seo?: SEOMetadata;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: { sys: { id: string } };
  image?: {
    fields: {
      file: {
        url: string;
        details: {
          image: {
            width: number;
            height: number;
          };
        };
      };
    };
  };
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image: {
    url: string;
    width: number;
    height: number;
    alt?: string;
  };
}

// Function to get menu categories from Contentful
export async function getMenuCategories(locale = 'es'): Promise<MenuCategory[]> {
  return safeContentfulApiCall(
    async () => {
      const response = await client.getEntries({
        content_type: 'menuCategory',
        locale,
        order: 'sys.createdAt',
      });

      return response.items.map((item: { sys: { id: any; }; fields: { name: string; slug: string; description: string; }; }) => ({
        id: item.sys.id,
        name: item.fields.name as string,
        slug: item.fields.slug as string,
        description: item.fields.description as string || undefined,
      }));
    },
    'Error fetching menu categories',
    []
  );
}

// Function to get menu items from Contentful
export async function getMenuItems(locale = 'es'): Promise<MenuItem[]> {
  return safeContentfulApiCall(
    async () => {
      const response = await client.getEntries({
        content_type: 'menuItem',
        locale,
        include: 2,
      });
      
      return response.items.map((item: { sys: { id: any; }; fields: { name: string; description: string; price: string; category: { sys: { id: string; }; }; image: any; }; }) => ({
        id: item.sys.id,
        name: item.fields.name as string,
        description: item.fields.description as string,
        price: item.fields.price as string,
        category: item.fields.category as { sys: { id: string } },
        image: item.fields.image as any || undefined,
      }));
    },
    'Error fetching menu items',
    []
  );
}

// Function to get a specific page by slug
export async function getPageBySlug(slug: string, locale = 'es'): Promise<Page | null> {
  return safeContentfulApiCall(
    async () => {
      const response = await client.getEntries({
        content_type: 'page',
        'fields.slug': slug,
        locale,
        include: 3,
      });

      if (response.items.length === 0) {
        return null;
      }

      const page = response.items[0];
      
      return {
        id: page.sys.id,
        title: page.fields.title as string,
        slug: page.fields.slug as string,
        content: page.fields.content as Document || undefined,
        seo: page.fields.seo as SEOMetadata || undefined,
        updatedAt: page.sys.updatedAt as string,
      };
    },
    `Error fetching page with slug "${slug}"`,
    null
  );
}

// Function to get all pages
export async function getAllPages(locale = 'es'): Promise<Page[]> {
  return safeContentfulApiCall(
    async () => {
      const response = await client.getEntries({
        content_type: 'page',
        locale,
        select: 'sys.id,fields.title,fields.slug,sys.updatedAt',
      });

      return response.items.map((page: { sys: { id: any; updatedAt: string; }; fields: { title: string; slug: string; }; }) => ({
        id: page.sys.id,
        title: page.fields.title as string,
        slug: page.fields.slug as string,
        updatedAt: page.sys.updatedAt as string,
      }));
    },
    'Error fetching all pages',
    []
  );
}

// Function to get gallery images
export async function getGalleryImages(locale = 'es'): Promise<GalleryImage[]> {
  return safeContentfulApiCall(
    async () => {
      const response = await client.getEntries({
        content_type: 'galleryImage',
        locale,
        order: '-sys.createdAt',
      });

      return response.items.map((item: { fields: { image: any; title: string; description: string; }; sys: { id: any; }; }) => {
        // Make sure we have an image before accessing its properties
        const imageField = item.fields.image as any;
        if (!imageField || !imageField.fields || !imageField.fields.file) {
          throw new Error(`Gallery image ${item.sys.id} has invalid image data`);
        }

        return {
          id: item.sys.id,
          title: item.fields.title as string,
          description: item.fields.description as string || undefined,
          image: {
            url: imageField.fields.file.url,
            width: imageField.fields.file.details.image.width,
            height: imageField.fields.file.details.image.height,
          }
        };
      });
    },
    'Error fetching gallery images',
    []
  );
}

// Function to get translation strings
export async function getTranslations(locale: string): Promise<Record<string, string>> {
  try {
    const response = await client.getEntries({
      content_type: 'translation',
      locale,
    });

    const translations: Record<string, string> = {};
    
    response.items.forEach((item: { fields: { key: string; value: string; }; }) => {
      translations[item.fields.key as string] = item.fields.value as string;
    });
    
    return translations;
  } catch (error) {
    console.error(`Error fetching translations for ${locale}:`, error);
    return {};
  }
}

// Create a separate management client for update operations
const managementClient = hasManagementCredentials 
  ? createManagementClient({ accessToken: managementToken! })
  : null;

// Interface for page update data
export interface PageUpdateData {
  title?: string;
  slug?: string;
  content?: Document;
  seo?: SEOMetadata;
}

/**
 * Restaurant settings interfaces
 */
export interface RestaurantSettings {
  id: string;
  name: string;
  description?: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  openingHours: OpeningHour[];
  socialMedia: SocialMediaLink[];
  updatedAt: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface SocialMediaLink {
  platform: string;
  url: string;
}

/**
 * Restaurant settings update data interface
 */
export interface RestaurantSettingsUpdateData {
  name?: string;
  description?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  openingHours?: {
    [key: string]: {
      open?: string;
      close?: string;
      closed?: boolean;
    };
  };
  socialMedia?: {
    [key: string]: string;
  };
}

/**
 * Get restaurant settings
 */
export async function getRestaurantSettings(locale = 'es'): Promise<RestaurantSettings | null> {
  return safeContentfulApiCall(
    async () => {
      const space = await client.getSpace(spaceId!);
      const env = await space.getEnvironment(environment);
      const entries = await env.getEntries({
        content_type: 'restaurantSettings',
        locale,
        limit: 1,
      });

      if (entries.items.length === 0) {
        return null;
      }

      const settings = entries.items[0];
      
      // Process opening hours
      const openingHours: OpeningHour[] = [];
      
      if (settings.fields.openingHours && settings.fields.openingHours[locale]) {
        for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
          const dayData = settings.fields.openingHours[locale][day];
          
          if (dayData) {
            openingHours.push({
              day,
              open: dayData.open || '',
              close: dayData.close || '',
              closed: dayData.closed || false,
            });
          } else {
            // Ensure all days are included even if they don't have data
            openingHours.push({
              day,
              open: '',
              close: '',
              closed: true,
            });
          }
        }
      }

      // Process social media links
      const socialMedia: SocialMediaLink[] = [];
      
      if (settings.fields.socialMedia && settings.fields.socialMedia[locale]) {
        for (const platform of Object.keys(settings.fields.socialMedia[locale])) {
          const url = settings.fields.socialMedia[locale][platform];
          
          if (url) {
            socialMedia.push({
              platform,
              url,
            });
          }
        }
      }

      return {
        id: settings.sys.id,
        name: settings.fields.name?.[locale] || '',
        description: settings.fields.description?.[locale] || undefined,
        contactInfo: {
          address: settings.fields.contactInfo?.[locale]?.address || '',
          phone: settings.fields.contactInfo?.[locale]?.phone || '',
          email: settings.fields.contactInfo?.[locale]?.email || '',
        },
        openingHours,
        socialMedia,
        updatedAt: settings.sys.updatedAt,
      };
    },
    'Error fetching restaurant settings',
    null
  );
}

/**
 * Update restaurant settings
 */
export async function updateRestaurantSettings(
  settingsId: string,
  updateData: RestaurantSettingsUpdateData,
  locale = 'es'
): Promise<RestaurantSettings | null> {
  if (!hasManagementCredentials || !managementClient) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      'Attempted to update Contentful data without valid management credentials. ' +
      'Make sure to set CONTENTFUL_MANAGEMENT_TOKEN in your .env.local file.'
    );
    return null;
  }

  try {
    // Get the space and environment
    const space = await managementClient.getSpace(spaceId!);
    const env = await space.getEnvironment(environment);

    // Get the entry
    const entry = await env.getEntry(settingsId);
    
    // Update name if provided
    if (updateData.name) {
      entry.fields.name = { 
        ...entry.fields.name,
        [locale]: updateData.name 
      };
    }

    // Update description if provided
    if (updateData.description) {
      entry.fields.description = { 
        ...entry.fields.description,
        [locale]: updateData.description 
      };
    }

    // Update contact info if provided
    if (updateData.contactInfo) {
      entry.fields.contactInfo = { 
        ...entry.fields.contactInfo,
        [locale]: {
          ...entry.fields.contactInfo?.[locale] || {},
          ...updateData.contactInfo
        }
      };
    }

    // Update opening hours if provided
    if (updateData.openingHours) {
      entry.fields.openingHours = { 
        ...entry.fields.openingHours,
        [locale]: {
          ...entry.fields.openingHours?.[locale] || {},
          ...updateData.openingHours
        }
      };
    }

    // Update social media if provided
    if (updateData.socialMedia) {
      entry.fields.socialMedia = { 
        ...entry.fields.socialMedia,
        [locale]: {
          ...entry.fields.socialMedia?.[locale] || {},
          ...updateData.socialMedia
        }
      };
    }

    // Update the entry
    const updatedEntry = await entry.update();
    
    // Publish the entry
    const publishedEntry = await updatedEntry.publish();
    
    // Return updated settings by calling getRestaurantSettings
    return getRestaurantSettings(locale);
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    return null;
  }
}

// Function to update a page in Contentful
export async function updatePage(
  pageId: string, 
  updateData: PageUpdateData, 
  locale = 'es'
): Promise<Page | null> {
  if (!hasManagementCredentials || !managementClient) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      'Attempted to update Contentful data without valid management credentials. ' +
      'Make sure to set CONTENTFUL_MANAGEMENT_TOKEN in your .env.local file.'
    );
    return null;
  }

  try {
    // Get the space and environment
    const space = await managementClient.getSpace(spaceId!);
    const env = await space.getEnvironment(environment);

    // Get the entry
    const entry = await env.getEntry(pageId);
    
    // Update the entry fields
    if (updateData.title) {
      entry.fields.title = { 
        ...entry.fields.title,
        [locale]: updateData.title 
      };
    }

    if (updateData.slug) {
      entry.fields.slug = { 
        ...entry.fields.slug,
        [locale]: updateData.slug 
      };
    }

    if (updateData.content) {
      entry.fields.content = { 
        ...entry.fields.content,
        [locale]: updateData.content 
      };
    }

    if (updateData.seo) {
      entry.fields.seo = { 
        ...entry.fields.seo,
        [locale]: updateData.seo 
      };
    }

    // Update the entry
    const updatedEntry = await entry.update();
    
    // Publish the entry
    const publishedEntry = await updatedEntry.publish();
    
    // Format the response to match our Page interface
    return {
      id: publishedEntry.sys.id,
      title: publishedEntry.fields.title[locale],
      slug: publishedEntry.fields.slug[locale],
      content: publishedEntry.fields.content?.[locale] || undefined,
      seo: publishedEntry.fields.seo?.[locale] || undefined,
      updatedAt: publishedEntry.sys.updatedAt,
    };
  } catch (error) {
    console.error('Error updating page:', error);
    return null;
  }
}

// Function to create a new page in Contentful
export async function createPage(
  pageData: PageUpdateData, 
  locale = 'es'
): Promise<Page | null> {
  if (!hasManagementCredentials || !managementClient) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      'Attempted to create Contentful data without valid management credentials. ' +
      'Make sure to set CONTENTFUL_MANAGEMENT_TOKEN in your .env.local file.'
    );
    return null;
  }

  try {
    // Get the space and environment
    const space = await managementClient.getSpace(spaceId!);
    const env = await space.getEnvironment(environment);

    // Create entry fields
    const fields: any = {};
    
    if (pageData.title) {
      fields.title = { [locale]: pageData.title };
    }

    if (pageData.slug) {
      fields.slug = { [locale]: pageData.slug };
    }

    if (pageData.content) {
      fields.content = { [locale]: pageData.content };
    }

    if (pageData.seo) {
      fields.seo = { [locale]: pageData.seo };
    }

    // Create the entry
    const createdEntry = await env.createEntry('page', {
      fields
    });
    
    // Publish the entry
    const publishedEntry = await createdEntry.publish();
    
    // Format the response to match our Page interface
    return {
      id: publishedEntry.sys.id,
      title: publishedEntry.fields.title[locale],
      slug: publishedEntry.fields.slug[locale],
      content: publishedEntry.fields.content?.[locale] || undefined,
      seo: publishedEntry.fields.seo?.[locale] || undefined,
      updatedAt: publishedEntry.sys.updatedAt,
    };
  } catch (error) {
    console.error('Error creating page:', error);
    return null;
  }
}
