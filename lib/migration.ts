/**
 * Migration script to migrate data from JSON files to Supabase database
 * 
 * This script reads the JSON files in the public/data directory
 * and inserts the data into the corresponding Supabase tables.
 */

import fs from 'fs/promises';
import path from 'path';
import { supabase, getServiceSupabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import type { Database } from './database.types';

// Use service role client for admin operations
const serviceClient = getServiceSupabase();

// Define base path for JSON files
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// Logger for migration process
class MigrationLogger {
  private startTime: number;
  private entityCounts: Record<string, number> = {};

  constructor() {
    this.startTime = Date.now();
    console.log('🚀 Starting migration process...');
  }

  log(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  incrementCount(entity: string): void {
    this.entityCounts[entity] = (this.entityCounts[entity] || 0) + 1;
  }

  summarize(): void {
    const durationSec = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n✅ Migration completed');
    console.log(`⏱️  Duration: ${durationSec} seconds`);
    console.log('\n📊 Entities migrated:');
    
    Object.entries(this.entityCounts).forEach(([entity, count]) => {
      console.log(`   - ${entity}: ${count}`);
    });
  }
}

// Helper to read and parse JSON file
async function readJsonFile<T>(filename: string): Promise<T> {
  const logger = new MigrationLogger();
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Failed to read JSON file: ${filename}`, error);
    throw error;
  }
}

// Migrate menu categories
async function migrateMenuCategories(logger: MigrationLogger): Promise<Map<string, string>> {
  logger.log('Migrating menu categories...');
  const idMap = new Map<string, string>();
  
  try {
    const menuData = await readJsonFile<{
      categories: Array<{
        id: string;
        name: Record<string, string>;
        slug: string;
        description?: Record<string, string>;
      }>;
    }>('menu.json');
    
    for (const category of menuData.categories) {
      // Generate a new UUID for the category
      const newId = uuidv4();
      idMap.set(category.id, newId);
      
      const { error } = await serviceClient
        .from('menu_categories')
        .insert({
          id: newId,
          slug: category.slug || category.id,
          name: category.name,
          description: category.description || null,
        });
      
      if (error) {
        logger.error(`Failed to insert menu category: ${category.id}`, error);
      } else {
        logger.incrementCount('menu_categories');
      }
    }
    
    return idMap;
  } catch (error) {
    logger.error('Failed to migrate menu categories', error);
    return idMap;
  }
}

// Migrate menu items
async function migrateMenuItems(
  categoryIdMap: Map<string, string>,
  logger: MigrationLogger
): Promise<void> {
  logger.log('Migrating menu items...');
  
  try {
    const menuData = await readJsonFile<{
      items: Array<{
        id: string;
        name: Record<string, string>;
        description?: Record<string, string>;
        price: string;
        categoryId: string;
        image?: string;
      }>;
    }>('menu.json');
    
    for (const item of menuData.items) {
      // Get the new category ID from the map
      const categoryId = categoryIdMap.get(item.categoryId);
      
      if (!categoryId) {
        logger.error(`Menu item ${item.id} references unknown category ID: ${item.categoryId}`);
        continue;
      }
      
      const { error } = await serviceClient
        .from('menu_items')
        .insert({
          id: uuidv4(),
          name: item.name,
          description: item.description || null,
          price: item.price,
          category_id: categoryId,
          image_url: item.image || null,
        });
      
      if (error) {
        logger.error(`Failed to insert menu item: ${item.id}`, error);
      } else {
        logger.incrementCount('menu_items');
      }
    }
  } catch (error) {
    logger.error('Failed to migrate menu items', error);
  }
}

// Migrate beverage categories
async function migrateBeverageCategories(logger: MigrationLogger): Promise<Map<string, string>> {
  logger.log('Migrating beverage categories...');
  const idMap = new Map<string, string>();
  
  try {
    const beverageData = await readJsonFile<{
      categories: Array<{
        id: string;
        name: Record<string, string>;
        slug: string;
        description?: Record<string, string>;
      }>;
    }>('beverages.json');
    
    for (const category of beverageData.categories) {
      // Generate a new UUID for the category
      const newId = uuidv4();
      idMap.set(category.id, newId);
      
      const { error } = await serviceClient
        .from('beverage_categories')
        .insert({
          id: newId,
          slug: category.slug || category.id,
          name: category.name,
          description: category.description || null,
        });
      
      if (error) {
        logger.error(`Failed to insert beverage category: ${category.id}`, error);
      } else {
        logger.incrementCount('beverage_categories');
      }
    }
    
    return idMap;
  } catch (error) {
    logger.error('Failed to migrate beverage categories', error);
    return idMap;
  }
}

// Migrate beverage items
async function migrateBeverageItems(
  categoryIdMap: Map<string, string>,
  logger: MigrationLogger
): Promise<void> {
  logger.log('Migrating beverage items...');
  
  try {
    const beverageData = await readJsonFile<{
      items: Array<{
        id: string;
        name: Record<string, string>;
        description?: Record<string, string>;
        price: string;
        categoryId: string;
        image?: string;
      }>;
    }>('beverages.json');
    
    for (const item of beverageData.items) {
      // Get the new category ID from the map
      const categoryId = categoryIdMap.get(item.categoryId);
      
      if (!categoryId) {
        logger.error(`Beverage item ${item.id} references unknown category ID: ${item.categoryId}`);
        continue;
      }
      
      const { error } = await serviceClient
        .from('beverage_items')
        .insert({
          id: uuidv4(),
          name: item.name,
          description: item.description || null,
          price: item.price,
          category_id: categoryId,
          image_url: item.image || null,
        });
      
      if (error) {
        logger.error(`Failed to insert beverage item: ${item.id}`, error);
      } else {
        logger.incrementCount('beverage_items');
      }
    }
  } catch (error) {
    logger.error('Failed to migrate beverage items', error);
  }
}

// Migrate gallery images
async function migrateGalleryImages(logger: MigrationLogger): Promise<void> {
  logger.log('Migrating gallery images...');
  
  try {
    const galleryData = await readJsonFile<{
      images: Array<{
        id: string;
        title: Record<string, string>;
        description?: Record<string, string>;
        image: string;
      }>;
    }>('gallery.json');
    
    for (const image of galleryData.images) {
      const { error } = await serviceClient
        .from('gallery_images')
        .insert({
          id: uuidv4(),
          title: image.title,
          description: image.description || null,
          image_url: image.image,
        });
      
      if (error) {
        logger.error(`Failed to insert gallery image: ${image.id}`, error);
      } else {
        logger.incrementCount('gallery_images');
      }
    }
  } catch (error) {
    logger.error('Failed to migrate gallery images', error);
  }
}

// Migrate pages
async function migratePages(logger: MigrationLogger): Promise<void> {
  logger.log('Migrating pages...');
  
  try {
    const pagesData = await readJsonFile<{
      pages: Array<{
        id: string;
        slug: string;
        title: Record<string, string>;
        content: Record<string, any>;
        seo?: Record<string, any>;
      }>;
    }>('pages.json');
    
    for (const page of pagesData.pages) {
      const { error } = await serviceClient
        .from('pages')
        .insert({
          id: uuidv4(),
          slug: page.slug,
          title: page.title,
          content: page.content,
          seo: page.seo || null,
        });
      
      if (error) {
        logger.error(`Failed to insert page: ${page.id}`, error);
      } else {
        logger.incrementCount('pages');
      }
    }
  } catch (error) {
    logger.error('Failed to migrate pages', error);
  }
}

// Migrate settings
async function migrateSettings(logger: MigrationLogger): Promise<void> {
  logger.log('Migrating settings...');
  
  try {
    const settingsData = await readJsonFile<{
      id: string;
      name: Record<string, string>;
      description?: Record<string, string>;
      contactInfo: Record<string, any>;
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
    }>('settings.json');
    
    const { error } = await serviceClient
      .from('settings')
      .insert({
        id: uuidv4(),
        name: settingsData.name,
        description: settingsData.description || null,
        contact_info: settingsData.contactInfo,
        opening_hours: settingsData.openingHours,
        social_media: settingsData.socialMedia,
      });
    
    if (error) {
      logger.error('Failed to insert settings', error);
    } else {
      logger.incrementCount('settings');
    }
  } catch (error) {
    logger.error('Failed to migrate settings', error);
  }
}

// Migrate dishes
async function migrateDishes(logger: MigrationLogger): Promise<void> {
  logger.log('Migrating dishes...');
  
  try {
    const dishesData = await readJsonFile<{
      dishes: Array<{
        id: string;
        name: Record<string, string>;
        description: Record<string, string>;
        price: string;
        category: string;
        image?: string;
      }>;
    }>('dishes.json');
    
    for (const dish of dishesData.dishes) {
      const { error } = await serviceClient
        .from('dishes')
        .insert({
          id: uuidv4(),
          name: dish.name,
          description: dish.description,
          price: dish.price,
          category: dish.category,
          image_url: dish.image || null,
        });
      
      if (error) {
        logger.error(`Failed to insert dish: ${dish.id}`, error);
      } else {
        logger.incrementCount('dishes');
      }
    }
  } catch (error) {
    logger.error('Failed to migrate dishes', error);
  }
}

// Main migration function
export async function migrateData(): Promise<void> {
  const logger = new MigrationLogger();
  
  try {
    // Step 1: Migrate menu categories and get ID mapping
    const menuCategoryIdMap = await migrateMenuCategories(logger);
    
    // Step 2: Migrate menu items using the category ID mapping
    await migrateMenuItems(menuCategoryIdMap, logger);
    
    // Step 3: Migrate beverage categories and get ID mapping
    const beverageCategoryIdMap = await migrateBeverageCategories(logger);
    
    // Step 4: Migrate beverage items using the category ID mapping
    await migrateBeverageItems(beverageCategoryIdMap, logger);
    
    // Step 5: Migrate gallery images
    await migrateGalleryImages(logger);
    
    // Step 6: Migrate pages
    await migratePages(logger);
    
    // Step 7: Migrate settings
    await migrateSettings(logger);
    
    // Step 8: Migrate dishes
    await migrateDishes(logger);
    
    // Summarize migration results
    logger.summarize();
  } catch (error) {
    logger.error('Migration failed', error);
    process.exit(1);
  }
}

// Standalone script execution
if (require.main === module) {
  migrateData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration script failed with error:', error);
      process.exit(1);
    });
}

