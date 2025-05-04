import { supabase, getServiceSupabase, getLocalizedValue } from './supabase';
import type { Database } from './supabase';

/**
 * Interface for Gallery Image with localized fields
 */
export interface GalleryImage {
  id: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  image_url: string;
  image_width?: number;
  image_height?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches gallery images from Supabase with localized content for the specified locale
 * @param locale The locale code (e.g., 'en', 'es') for localizing content
 * @returns Array of gallery images with properly localized title and description
 */
export async function getGalleryImagesFromSupabase(locale: string): Promise<GalleryImage[]> {
  try {
    // Get gallery images from Supabase
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery images from Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('No gallery images found in Supabase');
      return [];
    }

    // Transform the database records to our application model
    // and localize the content based on the requested locale
    return data.map(image => ({
      id: image.id,
      title: image.title as Record<string, string>,
      description: image.description as Record<string, string> | undefined,
      image_url: image.image_url,
      image_width: image.image_width || undefined,
      image_height: image.image_height || undefined,
      created_at: image.created_at || undefined,
      updated_at: image.updated_at || undefined,
      // Add localized values as convenience properties
      localizedTitle: getLocalizedValue(image.title as Record<string, string>, locale),
      localizedDescription: image.description 
        ? getLocalizedValue(image.description as Record<string, string>, locale) 
        : undefined
    })) as GalleryImage[];
  } catch (error) {
    console.error('Error in getGalleryImagesFromSupabase:', error);
    return [];
  }
}

/**
 * Uploads a new gallery image to Supabase
 * @param imageData Object containing image metadata including multilingual title and description
 * @returns The newly created gallery image record or null if operation fails
 */
export async function uploadGalleryImageToSupabase(imageData: {
  title: Record<string, string>;
  description?: Record<string, string>;
  image_url: string;
  image_width?: number;
  image_height?: number;
}): Promise<GalleryImage | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Prepare the data for insertion
    const insertData = {
      title: imageData.title,
      description: imageData.description || null,
      image_url: imageData.image_url,
      image_width: imageData.image_width || null,
      image_height: imageData.image_height || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the new gallery image
    const { data, error } = await serviceClient
      .from('gallery_images')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error uploading gallery image to Supabase:', error);
      return null;
    }

    // Return the newly created gallery image
    return {
      id: data.id,
      title: data.title as Record<string, string>,
      description: data.description as Record<string, string> | undefined,
      image_url: data.image_url,
      image_width: data.image_width || undefined,
      image_height: data.image_height || undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error('Error in uploadGalleryImageToSupabase:', error);
    return null;
  }
}

/**
 * Updates an existing gallery image in Supabase
 * @param imageId The ID of the gallery image to update
 * @param updateData Object containing image metadata to update
 * @returns The updated gallery image record or null if operation fails
 */
export async function updateGalleryImageInSupabase(
  imageId: string,
  updateData: {
    title?: Record<string, string>;
    description?: Record<string, string> | null;
    image_url?: string;
    image_width?: number | null;
    image_height?: number | null;
  }
): Promise<GalleryImage | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Add updated timestamp
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Handle special case for removing description
    if (updateData.description === null) {
      dataToUpdate.description = null;
    }

    // Update the gallery image
    const { data, error } = await serviceClient
      .from('gallery_images')
      .update(dataToUpdate)
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating gallery image with ID ${imageId} in Supabase:`, error);
      return null;
    }

    // Return the updated gallery image
    return {
      id: data.id,
      title: data.title as Record<string, string>,
      description: data.description as Record<string, string> | undefined,
      image_url: data.image_url,
      image_width: data.image_width || undefined,
      image_height: data.image_height || undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error(`Error in updateGalleryImageInSupabase for ID ${imageId}:`, error);
    return null;
  }
}

/**
 * Deletes a gallery image from Supabase by ID
 * @param imageId The ID of the gallery image to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteGalleryImageFromSupabase(imageId: string): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Delete the gallery image
    const { error } = await serviceClient
      .from('gallery_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error(`Error deleting gallery image with ID ${imageId} from Supabase:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteGalleryImageFromSupabase for ID ${imageId}:`, error);
    return false;
  }
}

