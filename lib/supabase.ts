import { createClient } from '@supabase/supabase-js'
//import { Database as ImportedDatabase } from './database.types'


export type Settings = {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  contact_info: Record<string, any>;
  opening_hours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  social_media: Array<{
    platform: string;
    url: string;
  }>;
};

export type Dish = {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: string;
  category: string;
  image_url?: string;
};



// Types for the database tables based on SQL schema
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string;
          slug: string;
          name: Json;
          description: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: Json;
          description?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: Json;
          description?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: Json;
          description: Json | null;
          price: string;
          category_id: string | null;
          image_url: string | null;
          image_width: number | null;
          image_height: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: Json;
          description?: Json | null;
          price: string;
          category_id?: string | null;
          image_url?: string | null;
          image_width?: number | null;
          image_height?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: Json;
          description?: Json | null;
          price?: string;
          category_id?: string | null;
          image_url?: string | null;
          image_width?: number | null;
          image_height?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      beverage_categories: {
        Row: {
          id: string;
          slug: string;
          name: Json;
          description: Json | null;
          parent_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: Json;
          description?: Json | null;
          parent_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: Json;
          description?: Json | null;
          parent_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      beverage_items: {
        Row: {
          id: string;
          name: Json;
          description: Json | null;
          price: string;
          category_id: string | null;
          image_url: string | null;
          image_width: number | null;
          image_height: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: Json;
          description?: Json | null;
          price: string;
          category_id?: string | null;
          image_url?: string | null;
          image_width?: number | null;
          image_height?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: Json;
          description?: Json | null;
          price?: string;
          category_id?: string | null;
          image_url?: string | null;
          image_width?: number | null;
          image_height?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          title: Json;
          description: Json | null;
          image_url: string;
          image_width: number | null;
          image_height: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: Json;
          description?: Json | null;
          image_url: string;
          image_width?: number | null;
          image_height?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: Json;
          description?: Json | null;
          image_url?: string;
          image_width?: number | null;
          image_height?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: Json;
          content: Json;
          seo: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: Json;
          content: Json;
          seo?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: Json;
          content?: Json;
          seo?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      settings: {
        Row: {
          id: string;
          name: Json;
          description: Json | null;
          contact_info: Json;
          opening_hours: Json;
          social_media: Json;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: Json;
          description?: Json | null;
          contact_info: Json;
          opening_hours: Json;
          social_media: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: Json;
          description?: Json | null;
          contact_info?: Json;
          opening_hours?: Json;
          social_media?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      dishes: {
        Row: {
          id: string;
          name: Json;
          description: Json;
          price: string;
          category: string;
          image_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: Json;
          description: Json;
          price: string;
          category: string;
          image_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: Json;
          description?: Json;
          price?: string;
          category?: string;
          image_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}

// Environment variables type definition
// Add these to .env.local file


// Create Supabase client
/*if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}*/
/*
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}*/

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cemfoyrzsaanmkvpvzsm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbWZveXJ6c2Fhbm1rdnB2enNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTYyMTYsImV4cCI6MjA2MTkzMjIxNn0.8sMulEOA2zfSw0JWjIwU4jaesRmkqGmXBrwG0ozRnKs'
);

// Interface for environment variables used in Supabase client creation
export interface SupabaseEnvironmentVars {
  url: string;
  key: string;
}

// Function to get server-side client with service role for admin operations
export const getServiceSupabase = (): ReturnType<typeof createClient<Database>> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!serviceRoleKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};

// Interface for localized content
export interface LocalizedContent {
  [locale: string]: string;
}

// Helper function to get a localized value
export function getLocalizedValue(obj: Record<string, string> | string, locale: string): string {
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['en'] || '';
}

// Helper type para categorías de bebidas con subcategorías
export type BeverageCategoryWithChildren = {
  id: string;
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  parent_id: string | null;
  children?: BeverageCategoryWithChildren[];
};

// Helper function to build a hierarchical structure of beverage categories
export function buildCategoryTree(categories: BeverageCategoryWithChildren[]): BeverageCategoryWithChildren[] {
  const categoryMap = new Map<string, BeverageCategoryWithChildren>();
  const rootCategories: BeverageCategoryWithChildren[] = [];

  // First pass: add all categories to map
  categories.forEach(category => {
    categoryMap.set(category.id, {...category, children: []});
  });

  // Second pass: build the tree structure
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!;
    
    if (category.parent_id === null) {
      // This is a root category
      rootCategories.push(categoryWithChildren);
    } else {
      // This is a child category
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(categoryWithChildren);
      }
    }
  });

  return rootCategories;
}