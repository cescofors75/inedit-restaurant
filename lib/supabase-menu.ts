import { supabase, getServiceSupabase, getLocalizedValue } from './supabase';
import type { Database } from './supabase';

/**
 * Interface for MenuCategory with localized fields
 */
export interface MenuCategory {
  id: string;
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for MenuItem with localized fields
 */
export interface MenuItem {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price: string;
  category_id?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches all menu categories from Supabase with localized content for the specified locale
 * @param locale The locale code (e.g., 'en', 'es') for localizing content
 * @returns Array of menu categories with properly localized title and description
 */
export async function getMenuCategoriesFromSupabase(locale: string): Promise<MenuCategory[]> {
  try {
    // Get menu categories from Supabase
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menu categories from Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('No menu categories found in Supabase');
      return [];
    }

    // Transform the database records to our application model
    return data.map(category => ({
      id: category.id,
      slug: category.slug,
      name: category.name as Record<string, string>,
      description: category.description as Record<string, string> | undefined,
      created_at: category.created_at || undefined,
      updated_at: category.updated_at || undefined
    }));
  } catch (error) {
    console.error('Error in getMenuCategoriesFromSupabase:', error);
    return [];
  }
}

/**
 * Fetches all menu items from Supabase with localized content for the specified locale
 * @param locale The locale code (e.g., 'en', 'es') for localizing content
 * @returns Array of menu items with properly localized name and description
 */
export async function getMenuItemsFromSupabase(locale: string): Promise<MenuItem[]> {
  try {
    // Get menu items from Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menu items from Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('No menu items found in Supabase');
      return [];
    }

    // Transform the database records to our application model
    return data.map(item => ({
      id: item.id,
      name: item.name as Record<string, string>,
      description: item.description as Record<string, string> | undefined,
      price: item.price,
      category_id: item.category_id || undefined,
      image_url: item.image_url || undefined,
      image_width: item.image_width || undefined,
      image_height: item.image_height || undefined,
      created_at: item.created_at || undefined,
      updated_at: item.updated_at || undefined
    }));
  } catch (error) {
    console.error('Error in getMenuItemsFromSupabase:', error);
    return [];
  }
}

/**
 * Fetches menu items for a specific category from Supabase
 * @param categoryId The ID of the category to fetch items for
 * @param locale The locale code for localizing content
 * @returns Array of menu items for the specified category
 */
export async function getMenuItemsByCategoryFromSupabase(categoryId: string, locale: string): Promise<MenuItem[]> {
  try {
    // Get menu items by category from Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching menu items for category ID ${categoryId} from Supabase:`, error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn(`No menu items found for category ID ${categoryId} in Supabase`);
      return [];
    }

    // Transform the database records to our application model
    return data.map(item => ({
      id: item.id,
      name: item.name as Record<string, string>,
      description: item.description as Record<string, string> | undefined,
      price: item.price,
      category_id: item.category_id || undefined,
      image_url: item.image_url || undefined,
      image_width: item.image_width || undefined,
      image_height: item.image_height || undefined,
      created_at: item.created_at || undefined,
      updated_at: item.updated_at || undefined
    }));
  } catch (error) {
    console.error(`Error in getMenuItemsByCategoryFromSupabase for category ID ${categoryId}:`, error);
    return [];
  }
}

/**
 * Creates a new menu category in Supabase
 * @param categoryData Object containing category data including multilingual name and description
 * @returns The newly created category record or null if operation fails
 */
export async function createMenuCategoryInSupabase(categoryData: {
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
}): Promise<MenuCategory | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Check if a category with the same slug already exists
    const { data: existingCategory } = await serviceClient
      .from('menu_categories')
      .select('id')
      .eq('slug', categoryData.slug)
      .single();

    if (existingCategory) {
      console.error(`Menu category with slug "${categoryData.slug}" already exists`);
      return null;
    }
    
    // Prepare the data for insertion
    const insertData = {
      slug: categoryData.slug,
      name: categoryData.name,
      description: categoryData.description || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the new category
    const { data, error } = await serviceClient
      .from('menu_categories')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating menu category in Supabase:', error);
      return null;
    }

    // Return the newly created category
    return {
      id: data.id,
      slug: data.slug,
      name: data.name as Record<string, string>,
      description: data.description as Record<string, string> | undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error('Error in createMenuCategoryInSupabase:', error);
    return null;
  }
}

/**
 * Updates an existing menu category in Supabase
 * @param categoryId The ID of the category to update
 * @param updateData Object containing category data to update
 * @returns The updated category record or null if operation fails
 */
export async function updateMenuCategoryInSupabase(
  categoryId: string,
  updateData: {
    slug?: string;
    name?: Record<string, string>;
    description?: Record<string, string> | null;
  }
): Promise<MenuCategory | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // If updating slug, check if a category with the same slug already exists (except for the current category)
    if (updateData.slug) {
      const { data: existingCategory } = await serviceClient
        .from('menu_categories')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', categoryId)
        .single();

      if (existingCategory) {
        console.error(`Menu category with slug "${updateData.slug}" already exists`);
        return null;
      }
    }
    
    // Add updated timestamp
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Handle special case for removing description
    if (updateData.description === null) {
      dataToUpdate.description = null;
    }

    // Update the category
    const { data, error } = await serviceClient
      .from('menu_categories')
      .update(dataToUpdate)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating menu category with ID ${categoryId} in Supabase:`, error);
      return null;
    }

    // Return the updated category
    return {
      id: data.id,
      slug: data.slug,
      name: data.name as Record<string, string>,
      description: data.description as Record<string, string> | undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error(`Error in updateMenuCategoryInSupabase for ID ${categoryId}:`, error);
    return null;
  }
}

/**
 * Deletes a menu category from Supabase by ID
 * @param categoryId The ID of the category to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteMenuCategoryFromSupabase(categoryId: string): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // First update all items in this category to have null category_id
    const { error: updateError } = await serviceClient
      .from('menu_items')
      .update({ category_id: null })
      .eq('category_id', categoryId);
    
    if (updateError) {
      console.error(`Error updating menu items for deleted category ${categoryId}:`, updateError);
      return false;
    }
    
    // Delete the category
    const { error } = await serviceClient
      .from('menu_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error(`Error deleting menu category with ID ${categoryId} from Supabase:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteMenuCategoryFromSupabase for ID ${categoryId}:`, error);
    return false;
  }
}

/**
 * Creates a new menu item in Supabase
 * @param itemData Object containing item data including multilingual name and description
 * @returns The newly created item record or null if operation fails
 */
export async function createMenuItemInSupabase(itemData: {
  name: Record<string, string>;
  description?: Record<string, string>;
  price: string;
  category_id?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
}): Promise<MenuItem | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Prepare the data for insertion
    const insertData = {
      name: itemData.name,
      description: itemData.description || null,
      price: itemData.price,
      category_id: itemData.category_id || null,
      image_url: itemData.image_url || null,
      image_width: itemData.image_width || null,
      image_height: itemData.image_height || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the new item
    const { data, error } = await serviceClient
      .from('menu_items')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating menu item in Supabase:', error);
      return null;
    }

    // Return the newly created item
    return {
      id: data.id,
      name: data.name as Record<string, string>,
      description: data.description as Record<string, string> | undefined,
      price: data.price,
      category_id: data.category_id || undefined,
      image_url: data.image_url || undefined,
      image_width: data.image_width || undefined,
      image_height: data.image_height || undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error('Error in createMenuItemInSupabase:', error);
    return null;
  }
}

/**
 * Updates an existing menu item in Supabase
 * @param itemId The ID of the item to update
 * @param updateData Object containing item data to update
 * @returns The updated item record or null if operation fails
 */
export async function updateMenuItemInSupabase(
  itemId: string,
  updateData: {
    name?: Record<string, string>;
    description?: Record<string, string> | null;
    price?: string;
    category_id?: string | null;
    image_url?: string | null;
    image_width?: number | null;
    image_height?: number | null;
  }
): Promise<MenuItem | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Add updated timestamp
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Handle special cases for removing fields
    if (updateData.description === null) {
      dataToUpdate.description = null;
    }
    
    if (updateData.image_url === null) {
      dataToUpdate.image_url = null;
      dataToUpdate.image_width = null;
      dataToUpdate.image_height = null;
    }

    // Update the item
    const { data, error } = await serviceClient
      .from('menu_items')
      .update(dataToUpdate)
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating menu item with ID ${itemId} in Supabase:`, error);
      return null;
    }

    // Return the updated item
    return {
      id: data.id,
      name: data.name as Record<string, string>,
      description: data.description as Record<string, string> | undefined,
      price: data.price,
      category_id: data.category_id || undefined,
      image_url: data.image_url || undefined,
      image_width: data.image_width || undefined,
      image_height: data.image_height || undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error(`Error in updateMenuItemInSupabase for ID ${itemId}:`, error);
    return null;
  }
}

/**
 * Deletes a menu item from Supabase by ID
 * @param itemId The ID of the item to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteMenuItemFromSupabase(itemId: string): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Delete the item
    const { error } = await serviceClient
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error(`Error deleting menu item with ID ${itemId} from Supabase:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteMenuItemFromSupabase for ID ${itemId}:`, error);
    return false;
  }
}

