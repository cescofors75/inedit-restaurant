import { supabase, getLocalizedValue, getServiceSupabase, type Settings } from '@/lib/supabase';
import type { RestaurantSettings } from '@/lib/api';

/**
 * Fetches translations for a specific locale from Supabase
 * @param locale The locale code (e.g., 'en', 'es')
 * @returns Record of translation keys and values, or null if fetch fails
 */
export async function getTranslationsFromSupabase(locale: string): Promise<Record<string, string> | null> {
  try {
    // Get translations from Supabase for the specified locale
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('locale', locale);

    if (error) {
      console.error(`Error fetching translations for locale ${locale} from Supabase:`, error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn(`No translations found for locale ${locale} in Supabase`);
      return {};
    }

    // Transform the array of translation records into a key-value object
    const translations: Record<string, string> = {};
    data.forEach((item) => {
      translations[item.key] = item.value;
    });

    return translations;
  } catch (error) {
    console.error(`Error in getTranslationsFromSupabase for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Updates translations for a specific locale in Supabase
 * @param locale The locale code (e.g., 'en', 'es')
 * @param translations Record of translation keys and values to update
 * @returns Boolean indicating success or failure
 */
export async function updateTranslationsInSupabase(
  locale: string,
  translations: Record<string, string>
): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Prepare the upsert data: convert the translations object to an array of records
    const upsertData = Object.entries(translations).map(([key, value]) => ({
      locale,
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    // For each translation entry, we'll use upsert to either update existing or insert new
    const { error } = await serviceClient
      .from('translations')
      .upsert(upsertData, { 
        onConflict: 'locale,key',
        ignoreDuplicates: false
      });

    if (error) {
      console.error(`Error updating translations for locale ${locale}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in updateTranslationsInSupabase for locale ${locale}:`, error);
    return false;
  }
}

/**
 * Deletes a translation key from all locales in Supabase
 * @param key The translation key to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteTranslationKeyFromSupabase(key: string): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Delete the translation key across all locales
    const { error } = await serviceClient
      .from('translations')
      .delete()
      .eq('key', key);

    if (error) {
      console.error(`Error deleting translation key ${key} from Supabase:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteTranslationKeyFromSupabase for key ${key}:`, error);
    return false;
  }
}
/**
 * Fetches restaurant settings from Supabase and transforms them to the application format
 * @param locale The locale to use for localized content
 * @returns Restaurant settings or null if not found
 */
export async function getRestaurantSettingsFromSupabase(locale: string = 'es'): Promise<RestaurantSettings | null> {
  try {
    // Get settings from Supabase
    const { data: settingsData, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching settings from Supabase:', error);
      return null;
    }

    if (!settingsData) {
      console.warn('No settings found in Supabase');
      return null;
    }

    // Transform Supabase data to application format
    return {
      id: settingsData.id,
      name: getLocalizedValue(settingsData.name, locale),
      description: settingsData.description ? getLocalizedValue(settingsData.description, locale) : undefined,
      contactInfo: {
        address: getLocalizedValue(settingsData.contact_info.address, locale),
        phone: settingsData.contact_info.phone,
        email: settingsData.contact_info.email
      },
      openingHours: Array.isArray(settingsData.opening_hours) 
        ? settingsData.opening_hours.map((hours: any) => ({
            day: hours.day,
            open: hours.open,
            close: hours.close,
            closed: hours.closed || false
          }))
        : [],
      socialMedia: Array.isArray(settingsData.social_media)
        ? settingsData.social_media.map((social: any) => ({
            platform: social.platform,
            url: social.url
          }))
        : []
    };
  } catch (error) {
    console.error('Error in getRestaurantSettingsFromSupabase:', error);
    return null;
  }
}

/**
 * Updates restaurant settings in Supabase
 * @param updateData The data to update
 * @returns Updated restaurant settings or null if update failed
 */
export async function updateRestaurantSettingsInSupabase(
  updateData: Partial<RestaurantSettings>
): Promise<RestaurantSettings | null> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // First, check if settings exist
    const { data: existingSettings, error: fetchError } = await serviceClient
      .from('settings')
      .select('id')
      .limit(1);

    if (fetchError) {
      console.error('Error checking existing settings:', fetchError);
      return null;
    }

    // Prepare data for Supabase
    const supabaseData: Partial<Settings['Update']> = {};

    // Only include fields that are provided in the update data
    if (updateData.name !== undefined) {
      // For multilingual fields, we need to ensure we don't overwrite existing translations
      // First get the current data to merge with updates
      const { data: currentSettings } = await serviceClient
        .from('settings')
        .select('name')
        .single();
      
      // If name is a string (already localized), we need to update just that locale
      if (typeof updateData.name === 'string') {
        // We would need the locale information to know which key to update
        // For now, assuming we're updating the english version
        supabaseData.name = {
          ...(currentSettings?.name || {}),
          en: updateData.name
        };
      } else {
        // If it's already a Record<string, string>, use it directly
        supabaseData.name = updateData.name;
      }
    }

    if (updateData.description !== undefined) {
      // Similar logic for description
      const { data: currentSettings } = await serviceClient
        .from('settings')
        .select('description')
        .single();

      if (typeof updateData.description === 'string') {
        supabaseData.description = {
          ...(currentSettings?.description || {}),
          en: updateData.description
        };
      } else {
        supabaseData.description = updateData.description;
      }
    }

    if (updateData.contactInfo !== undefined) {
      // Transform contactInfo to Supabase format
      supabaseData.contact_info = {
        address: updateData.contactInfo.address,
        phone: updateData.contactInfo.phone,
        email: updateData.contactInfo.email
      };
    }

    if (updateData.openingHours !== undefined) {
      // Transform openingHours to Supabase format
      supabaseData.opening_hours = updateData.openingHours;
    }

    if (updateData.socialMedia !== undefined) {
      // Transform socialMedia to Supabase format
      supabaseData.social_media = updateData.socialMedia;
    }

    // Update or insert settings
    let result;
    if (existingSettings && existingSettings.length > 0) {
      // Update existing settings
      const { data, error: updateError } = await serviceClient
        .from('settings')
        .update(supabaseData)
        .eq('id', existingSettings[0].id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating settings:', updateError);
        return null;
      }

      result = data;
    } else {
      // Insert new settings
      const { data, error: insertError } = await serviceClient
        .from('settings')
        .insert({
          ...supabaseData,
          name: supabaseData.name || { en: '', es: '' }, 
          contact_info: supabaseData.contact_info || { address: { en: '', es: '' }, phone: '', email: '' },
          opening_hours: supabaseData.opening_hours || [],
          social_media: supabaseData.social_media || []
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting settings:', insertError);
        return null;
      }

      result = data;
    }

    // Fetch the complete updated settings and return transformed data
    return await getRestaurantSettingsFromSupabase();
  } catch (error) {
    console.error('Error in updateRestaurantSettingsInSupabase:', error);
    return null;
  }
}

/**
 * Helper function to determine if settings exist in Supabase
 * @returns true if settings exist, false otherwise
 */
export async function settingsExistInSupabase(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking if settings exist:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error in settingsExistInSupabase:', error);
    return false;
  }
}

/**
 * Function to initialize Supabase settings with default values if they don't exist yet
 */
export async function initializeSupabaseSettings(): Promise<boolean> {
  try {
    const exist = await settingsExistInSupabase();
    if (exist) {
      return true; // Settings already exist
    }

    // Create default settings
    const serviceClient = getServiceSupabase();
    const { error } = await serviceClient
      .from('settings')
      .insert({
        name: { 
          en: "Inedit Restaurant", 
          es: "Restaurante Inedit" 
        },
        description: {
          en: "A culinary journey through Mediterranean flavors",
          es: "Un viaje culinario a través de los sabores mediterráneos"
        },
        contact_info: {
          address: {
            en: "123 Seaside Avenue, Barcelona",
            es: "Avenida Marina 123, Barcelona"
          },
          phone: "+34 932 123 456",
          email: "info@inedit-restaurant.com"
        },
        opening_hours: [
          { day: "Monday", open: "12:00", close: "23:00", closed: false },
          { day: "Tuesday", open: "12:00", close: "23:00", closed: false },
          { day: "Wednesday", open: "12:00", close: "23:00", closed: false },
          { day: "Thursday", open: "12:00", close: "23:00", closed: false },
          { day: "Friday", open: "12:00", close: "00:00", closed: false },
          { day: "Saturday", open: "13:00", close: "00:00", closed: false },
          { day: "Sunday", open: "13:00", close: "22:00", closed: false }
        ],
        social_media: [
          { platform: "Instagram", url: "https://instagram.com/inedit" },
          { platform: "Facebook", url: "https://facebook.com/inedit" },
          { platform: "Twitter", url: "https://twitter.com/inedit" }
        ]
      });

    if (error) {
      console.error('Error initializing settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in initializeSupabaseSettings:', error);
    return false;
  }
}

