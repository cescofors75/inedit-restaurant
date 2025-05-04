import { supabase, getServiceSupabase } from "./supabase";

// Define Translations interface for the exported type
export interface Translations {
  [key: string]: string;
}

// Extend the Database type to include translations table
export type Database = {
  public: {
    Tables: {
      settings: {
        Row: {
          id?: string;
          name: Record<string, string>;
          description?: Record<string, string>;
          contact_info: {
            address: Record<string, string>;
            phone: string;
            email: string;
            website?: string;
            location: {
              lat: number;
              lng: number;
            };
          };
          opening_hours: Array<{
            days: Record<string, string>;
            hours: string;
          }>;
          social_media: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            youtube?: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: Record<string, string>;
          description?: Record<string, string>;
          contact_info: {
            address: Record<string, string>;
            phone: string;
            email: string;
            website?: string;
            location: {
              lat: number;
              lng: number;
            };
          };
          opening_hours: Array<{
            days: Record<string, string>;
            hours: string;
          }>;
          social_media: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            youtube?: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          id?: string;
          name: Record<string, string>;
          description?: Record<string, string>;
          contact_info: {
            address: Record<string, string>;
            phone: string;
            email: string;
            website?: string;
            location: {
              lat: number;
              lng: number;
            };
          };
          opening_hours: Array<{
            days: Record<string, string>;
            hours: string;
          }>;
          social_media: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            youtube?: string;
          };
          created_at?: string;
          updated_at?: string;
        }>;
      };
      translations: {
        Row: {
          id: string;
          locale: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          locale: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          id?: string;
          locale: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        }>;
      };
    };
  };
};

/**
 * Fetches all translation key-value pairs for a specified locale from the Supabase database
 * @param locale The locale code (e.g., "en", "es")
 * @returns A Record of translation keys to translated values, or null if an error occurs
 */
export async function getTranslationsFromSupabase(locale: string): Promise<Record<string, string> | null> {
  try {
    // Get translations from Supabase for the specified locale
    const { data, error } = await supabase
      .from('translations')
      .select('key, value')
      .eq('locale', locale);

    if (error) {
      console.error('Error fetching translations from Supabase:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn(`No translations found for locale: ${locale}`);
      return {};
    }

    // Transform array of {key, value} objects into a key-value Record
    const translations: Record<string, string> = {};
    data.forEach((item) => {
      translations[item.key] = item.value;
    });

    return translations;
  } catch (error) {
    console.error('Error in getTranslationsFromSupabase:', error);
    return null;
  }
}

/**
 * Updates or inserts translation entries for a given locale
 * @param locale The locale code (e.g., "en", "es")
 * @param translations A Record of translation keys to translated values
 * @returns true if successful, false otherwise
 */
export async function updateTranslationsInSupabase(
  locale: string,
  translations: Record<string, string>
): Promise<boolean> {
  try {
    // Use service role client for admin operations
    const serviceClient = getServiceSupabase();
    
    // Prepare data for upsert
    const upsertData = Object.entries(translations).map(([key, value]) => ({
      locale,
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    // Upsert the translations
    const { error } = await serviceClient
      .from('translations')
      .upsert(upsertData, {
        onConflict: 'locale,key', // Conflict resolution based on unique combination of locale and key
        ignoreDuplicates: false, // Update existing entries
      });

    if (error) {
      console.error('Error updating translations in Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateTranslationsInSupabase:', error);
    return false;
  }
}

/**
 * Deletes all translations for a given key across all locales
 * @param key The translation key to delete
 * @returns true if successful, false otherwise
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
      console.error('Error deleting translation key from Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTranslationKeyFromSupabase:', error);
    return false;
  }
}
