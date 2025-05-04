import { supabase, getServiceSupabase, getLocalizedValue } from './supabase';
import type { Database } from './supabase';

/**
 * Interface for Page with localized fields
 */
export interface Page {
  id: string;
  slug: string;
  title: Record<string, string>;
  content: Record<string, any>;
  seo?: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    keywords?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches all pages from Supabase with localized content for the specified locale
 * @param locale The locale code (e.g., 'en', 'es') for localizing content
 * @returns Array of pages with properly localized title and content
 */
export async function getPagesFromSupabase(locale: string): Promise<Page[]> {
  try {
    // Get pages from Supabase
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching pages from Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('No pages found in Supabase');
      return [];
    }

    // Transform the database records to our application model
    return data.map(page => ({
      id: page.id,
      slug: page.slug,
      title: page.title as Record<string, string>,
      content: page.content as Record<string, any>,
      seo: page.seo ? {
        title: (page.seo as any).title,
        description: (page.seo as any).description,
        keywords: (page.seo as any).keywords || []
      } : undefined,
      created_at: page.created_at || undefined,
      updated_at: page.updated_at || undefined
    }));
  } catch (error) {
    console.error('Error in getPagesFromSupabase:', error);
    return [];
  }
}

/**
 * Fetches a specific page by slug from Supabase with localized content
 * @param slug The slug of the page to fetch
 * @param locale The locale code for localizing content
 * @returns The page with properly localized content or null if not found
 */
export async function getPageBySlugFromSupabase(slug: string, locale: string): Promise<Page | null> {
  try {
    // Get page from Supabase by slug
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Code for "No rows found" - not a true error
        console.warn(`Page with slug "${slug}" not found`);
        return null;
      }
      console.error(`Error fetching page with slug "${slug}" from Supabase:`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform the database record to our application model
    return {
      id: data.id,
      slug: data.slug,
      title: data.title as Record<string, string>,
      content: data.content as Record<string, any>,
      seo: data.seo ? {
        title: (data.seo as any).title,
        description: (data.seo as any).description,
        keywords: (data.seo as any).keywords || []
      } : undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error(`Error in getPageBySlugFromSupabase for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Creates a new page in Supabase
 * @param pageData Object containing page data including multilingual title and content
 * @returns The newly created page record or null if operation fails
 */
export async function createPageInSupabase(pageData: {
  slug: string;
  title: Record<string, string>;
  content: Record<string, any>;
  seo?: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    keywords?: string[];
  };
}): Promise<Page | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Check if a page with the same slug already exists
    const { data: existingPage } = await serviceClient
      .from('pages')
      .select('id')
      .eq('slug', pageData.slug)
      .single();

    if (existingPage) {
      console.error(`Page with slug "${pageData.slug}" already exists`);
      return null;
    }
    
    // Prepare the data for insertion
    const insertData = {
      slug: pageData.slug,
      title: pageData.title,
      content: pageData.content,
      seo: pageData.seo || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the new page
    const { data, error } = await serviceClient
      .from('pages')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating page in Supabase:', error);
      return null;
    }

    // Return the newly created page
    return {
      id: data.id,
      slug: data.slug,
      title: data.title as Record<string, string>,
      content: data.content as Record<string, any>,
      seo: data.seo ? {
        title: (data.seo as any).title,
        description: (data.seo as any).description,
        keywords: (data.seo as any).keywords || []
      } : undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error('Error in createPageInSupabase:', error);
    return null;
  }
}

/**
 * Updates an existing page in Supabase
 * @param pageId The ID of the page to update
 * @param updateData Object containing page data to update
 * @returns The updated page record or null if operation fails
 */
export async function updatePageInSupabase(
  pageId: string,
  updateData: {
    slug?: string;
    title?: Record<string, string>;
    content?: Record<string, any>;
    seo?: {
      title?: Record<string, string>;
      description?: Record<string, string>;
      keywords?: string[];
    } | null;
  }
): Promise<Page | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // If updating slug, check if a page with the same slug already exists (except for the current page)
    if (updateData.slug) {
      const { data: existingPage } = await serviceClient
        .from('pages')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', pageId)
        .single();

      if (existingPage) {
        console.error(`Page with slug "${updateData.slug}" already exists`);
        return null;
      }
    }
    
    // Add updated timestamp
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Handle special case for removing SEO
    if (updateData.seo === null) {
      dataToUpdate.seo = null;
    }

    // Update the page
    const { data, error } = await serviceClient
      .from('pages')
      .update(dataToUpdate)
      .eq('id', pageId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating page with ID ${pageId} in Supabase:`, error);
      return null;
    }

    // Return the updated page
    return {
      id: data.id,
      slug: data.slug,
      title: data.title as Record<string, string>,
      content: data.content as Record<string, any>,
      seo: data.seo ? {
        title: (data.seo as any).title,
        description: (data.seo as any).description,
        keywords: (data.seo as any).keywords || []
      } : undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error(`Error in updatePageInSupabase for ID ${pageId}:`, error);
    return null;
  }
}

/**
 * Deletes a page from Supabase by ID
 * @param pageId The ID of the page to delete
 * @returns Boolean indicating success or failure
 */
export async function deletePageFromSupabase(pageId: string): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Delete the page
    const { error } = await serviceClient
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) {
      console.error(`Error deleting page with ID ${pageId} from Supabase:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deletePageFromSupabase for ID ${pageId}:`, error);
    return false;
  }
}

