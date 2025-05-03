// lib/api.ts
import 'server-only'; // Mark this module as server-only
import fs from 'fs';
import path from 'path';

// Types
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: any;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  updatedAt?: string;
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
  categoryId: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
}

export interface BeverageCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BeverageItem {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
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
  };
}

export interface RestaurantSettings {
  id: string;
  name: string;
  description?: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  openingHours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
}

// Helper function to read JSON files
function readJsonFile(filePath: string): any {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'data', filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Helper function to write JSON files
async function writeJsonFile(filePath: string, data: any): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'data', filePath);
    const fileContent = JSON.stringify(data, null, 2); // Pretty-print with 2 spaces
    await fs.promises.writeFile(fullPath, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    return false;
  }
}

// Function to get a localized value
function getLocalizedValue(obj: Record<string, string> | string, locale: string): string {
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['en'] || '';
}

// API functions
export async function getPageBySlug(slug: string, locale = 'es'): Promise<Page | null> {
  const pages = readJsonFile('pages.json');
  if (!pages || !pages[slug]) return null;
  
  const page = pages[slug];
  
  return {
    id: page.id,
    title: getLocalizedValue(page.title, locale),
    slug: page.slug,
    content: page.content ? Object.fromEntries(
      Object.entries(page.content).map(([key, value]) => [key, getLocalizedValue(value as any, locale)])
    ) : {},
    seo: page.seo ? {
      title: getLocalizedValue(page.seo.title, locale),
      description: getLocalizedValue(page.seo.description, locale),
      keywords: page.seo.keywords
    } : undefined,
    updatedAt: new Date().toISOString() // Simulating an updated timestamp
  };
}

export async function getAllPages(locale = 'es'): Promise<Page[]> {
  const pages = readJsonFile('pages.json');
  if (!pages) return [];
  
  return Object.entries(pages).map(([slug, pageData]: [string, any]) => ({
    id: pageData.id,
    title: getLocalizedValue(pageData.title, locale),
    slug,
    updatedAt: new Date().toISOString() // Simulating an updated timestamp
  }));
}

export async function getMenuCategories(locale = 'es'): Promise<MenuCategory[]> {
  const menuData = readJsonFile('menu.json');
  if (!menuData || !menuData.categories) return [];
  
  return menuData.categories.map((category: any) => ({
    id: category.id,
    name: getLocalizedValue(category.name, locale),
    slug: category.slug,
    description: category.description ? getLocalizedValue(category.description, locale) : undefined
  }));
}

export async function getMenuItems(locale = 'es'): Promise<MenuItem[]> {
  const menuData = readJsonFile('menu.json');
  if (!menuData || !menuData.items) return [];
  
  return menuData.items.map((item: any) => ({
    id: item.id,
    name: getLocalizedValue(item.name, locale),
    description: getLocalizedValue(item.description, locale),
    price: item.price,
    categoryId: item.categoryId,
    image: item.image ? {
      url: item.image,
      width: 800, // Default width
      height: 600 // Default height
    } : undefined
  }));
}

export async function getMenuItemsByCategory(categoryId: string, locale = 'es'): Promise<MenuItem[]> {
  const items = await getMenuItems(locale);
  return items.filter(item => item.categoryId === categoryId);
}

export async function getBeverageCategories(locale = 'es'): Promise<BeverageCategory[]> {
  const beverageData = readJsonFile('beverages.json');
  if (!beverageData || !beverageData.categories) return [];
  
  return beverageData.categories.map((category: any) => ({
    id: category.id,
    name: getLocalizedValue(category.name, locale),
    slug: category.slug,
    description: category.description ? getLocalizedValue(category.description, locale) : undefined
  }));
}

export async function getBeverageItems(locale = 'es'): Promise<BeverageItem[]> {
  const beverageData = readJsonFile('beverages.json');
  if (!beverageData || !beverageData.items) return [];
  
  return beverageData.items.map((item: any) => ({
    id: item.id,
    name: getLocalizedValue(item.name, locale),
    description: getLocalizedValue(item.description, locale),
    price: item.price,
    categoryId: item.categoryId,
    image: item.image ? {
      url: item.image,
      width: 800, // Default width
      height: 600 // Default height
    } : undefined
  }));
}

export async function getBeverageItemsByCategory(categoryId: string, locale = 'es'): Promise<BeverageItem[]> {
  const items = await getBeverageItems(locale);
  return items.filter(item => item.categoryId === categoryId);
}

export async function getGalleryImages(locale = 'es'): Promise<GalleryImage[]> {
  const galleryData = readJsonFile('gallery.json');
  if (!galleryData || !galleryData.images) return [];
  
  return galleryData.images.map((item: any) => ({
    id: item.id,
    title: getLocalizedValue(item.title, locale),
    description: item.description ? getLocalizedValue(item.description, locale) : undefined,
    image: {
      url: item.image,
      width: 1200, // Default width
      height: 800 // Default height
    }
  }));
}

export async function getRestaurantSettings(locale = 'es'): Promise<RestaurantSettings | null> {
  const settings = readJsonFile('settings.json');
  if (!settings) return null;
  
  return {
    id: settings.id,
    name: getLocalizedValue(settings.name, locale),
    description: getLocalizedValue(settings.description, locale),
    contactInfo: {
      address: getLocalizedValue(settings.contactInfo.address, locale),
      phone: settings.contactInfo.phone,
      email: settings.contactInfo.email
    },
    openingHours: settings.openingHours,
    socialMedia: settings.socialMedia
  };
}

export async function getTranslations(locale: string): Promise<Record<string, string>> {
  const translations = readJsonFile(`translations/${locale}.json`);
  if (!translations) {
    // Fallback to English if the requested locale isn't available
    return readJsonFile('translations/en.json') || {};
  }
  return translations;
}

// Update functions
export async function updatePage(pageId: string, updateData: Partial<Page>): Promise<Page | null> {
  console.log('Update page called with:', { pageId, updateData });
  // In a future version, this would write to the JSON file
  return null;
}

export async function updateSettings(updateData: Partial<RestaurantSettings>): Promise<RestaurantSettings | null> {
  console.log('Update settings called with:', updateData);
  // In a future version, this would write to the JSON file
  return null;
}

// Beverage CRUD functions
export async function createBeverageCategory(newCategory: Omit<BeverageCategory, 'id'> & { localizedNames: Record<string, string>, localizedDescriptions?: Record<string, string> }): Promise<BeverageCategory | null> {
  try {
    const beverageData = readJsonFile('beverages.json');
    if (!beverageData) return null;

    // Generate a new ID
    const newId = `category_${Date.now()}`;
    
    // Prepare the new category object
    const categoryToAdd = {
      id: newId,
      name: newCategory.localizedNames,
      slug: newCategory.slug,
      description: newCategory.localizedDescriptions || {}
    };

    // Add the new category to the existing categories
    beverageData.categories.push(categoryToAdd);

    // Write the updated data back to the file
    const success = await writeJsonFile('beverages.json', beverageData);
    
    if (success) {
      return {
        id: newId,
        name: newCategory.localizedNames.en || Object.values(newCategory.localizedNames)[0] || '',
        slug: newCategory.slug,
        description: newCategory.localizedDescriptions?.en
      };
    }
    return null;
  } catch (error) {
    console.error('Error creating beverage category:', error);
    return null;
  }
}

export async function updateBeverageCategory(categoryId: string, updateData: Partial<BeverageCategory> & { localizedNames?: Record<string, string>, localizedDescriptions?: Record<string, string> }): Promise<BeverageCategory | null> {
  try {
    const beverageData = readJsonFile('beverages.json');
    if (!beverageData) return null;

    // Find the category to update
    const categoryIndex = beverageData.categories.findIndex((c: any) => c.id === categoryId);
    if (categoryIndex === -1) return null;

    // Update the category properties
    const currentCategory = beverageData.categories[categoryIndex];
    
    if (updateData.localizedNames) {
      currentCategory.name = { ...currentCategory.name, ...updateData.localizedNames };
    }
    
    if (updateData.localizedDescriptions) {
      currentCategory.description = { ...currentCategory.description || {}, ...updateData.localizedDescriptions };
    }
    
    if (updateData.slug) {
      currentCategory.slug = updateData.slug;
    }

    // Write the updated data back to the file
    const success = await writeJsonFile('beverages.json', beverageData);
    
    if (success) {
      // Return the updated category with the default locale for the response
      return {
        id: currentCategory.id,
        name: currentCategory.name.en || Object.values(currentCategory.name)[0] || '',
        slug: currentCategory.slug,
        description: currentCategory.description?.en
      };
    }
    return null;
  } catch (error) {
    console.error('Error updating beverage category:', error);
    return null;
  }
}

export async function deleteBeverageCategory(categoryId: string): Promise<boolean> {
  try {
    const beverageData = readJsonFile('beverages.json');
    if (!beverageData) return false;

    // Find the category to delete
    const categoryIndex = beverageData.categories.findIndex((c: any) => c.id === categoryId);
    if (categoryIndex === -1) return false;

    // Remove the category
    beverageData.categories.splice(categoryIndex, 1);

    // Update any items that reference this category
    beverageData.items = beverageData.items.map((item: any) => {
      if (item.categoryId === categoryId) {
        item.categoryId = ''; // Clear the category reference
      }
      return item;
    });

    // Write the updated data back to the file
    return await writeJsonFile('beverages.json', beverageData);
  } catch (error) {
    console.error('Error deleting beverage category:', error);
    return false;
  }
}

export async function createBeverageItem(newItem: Omit<BeverageItem, 'id'> & { localizedNames: Record<string, string>, localizedDescriptions: Record<string, string> }): Promise<BeverageItem | null> {
  try {
    const beverageData = readJsonFile('beverages.json');
    if (!beverageData) return null;

    // Generate a new ID
    const newId = `beverage_${Date.now()}`;
    
    // Prepare the new item object
    const itemToAdd = {
      id: newId,
      name: newItem.localizedNames,
      description: newItem.localizedDescriptions,
      price: newItem.price,
      categoryId: newItem.categoryId,
      image: newItem.image ? {
        url: newItem.image.url,
        width: newItem.image.width || 800,
        height: newItem.image.height || 600
      } : undefined
    };

    // Add the new item to the existing items
    beverageData.items.push(itemToAdd);

    // Write the updated data back to the file
    const success = await writeJsonFile('beverages.json', beverageData);
    
    if (success) {
      return {
        id: newId,
        name: newItem.localizedNames.en || Object.values(newItem.localizedNames)[0] || '',
        description: newItem.localizedDescriptions.en || Object.values(newItem.localizedDescriptions)[0] || '',
        price: newItem.price,
        categoryId: newItem.categoryId,
        image: newItem.image
      };
    }
    return null;
  } catch (error) {
    console.error('Error creating beverage item:', error);
    return null;
  }
}

export async function updateBeverageItem(itemId: string, updateData: Partial<BeverageItem> & { localizedNames?: Record<string, string>, localizedDescriptions?: Record<string, string> }): Promise<BeverageItem | null> {
  try {
    const beverageData = readJsonFile('beverages.json');
    if (!beverageData) return null;

    // Find the item to update
    const itemIndex = beverageData.items.findIndex((i: any) => i.id === itemId);
    if (itemIndex === -1) return null;

    // Update the item properties
    const currentItem = beverageData.items[itemIndex];
    
    if (updateData.localizedNames) {
      currentItem.name = { ...currentItem.name, ...updateData.localizedNames };
    }
    
    if (updateData.localizedDescriptions) {
      currentItem.description = { ...currentItem.description, ...updateData.localizedDescriptions };
    }
    
    if (updateData.price) {
      currentItem.price = updateData.price;
    }
    
    if (updateData.categoryId) {
      currentItem.categoryId = updateData.categoryId;
    }
    
    if (updateData.image) {
      currentItem.image = {
        url: updateData.image.url,
        width: updateData.image.width || 800,
        height: updateData.image.height || 600
      };
    }

    // Write the updated data back to the file
    const success = await writeJsonFile('beverages.json', beverageData);
    
    if (success) {
      // Return the updated item with the default locale for the response
      return {
        id: currentItem.id,
        name: currentItem.name.en || Object.values(currentItem.name)[0] || '',
        description: currentItem.description.en || Object.values(currentItem.description)[0] || '',
        price: currentItem.price,
        categoryId: currentItem.categoryId,
        image: currentItem.image
      };
    }
    return null;
  } catch (error) {
    console.error('Error updating beverage item:', error);
    return null;
  }
}

export async function deleteBeverageItem(itemId: string): Promise<boolean> {
  try {
    const beverageData = readJsonFile('beverages.json');
    if (!beverageData) return false;

    // Find the item to delete
    const itemIndex = beverageData.items.findIndex((i: any) => i.id === itemId);
    if (itemIndex === -1) return false;

    // Remove the item
    beverageData.items.splice(itemIndex, 1);

    // Write the updated data back to the file
    return await writeJsonFile('beverages.json', beverageData);
  } catch (error) {
    console.error('Error deleting beverage item:', error);
    return false;
  }
}

