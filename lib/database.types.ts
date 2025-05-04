export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string
          slug: string
          name: Json
          description: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: Json
          description?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: Json
          description?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: Json
          description: Json | null
          price: string
          category_id: string | null
          image_url: string | null
          image_width: number | null
          image_height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description?: Json | null
          price: string
          category_id?: string | null
          image_url?: string | null
          image_width?: number | null
          image_height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json | null
          price?: string
          category_id?: string | null
          image_url?: string | null
          image_width?: number | null
          image_height?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      beverage_categories: {
        Row: {
          id: string
          slug: string
          name: Json
          description: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: Json
          description?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: Json
          description?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      beverage_items: {
        Row: {
          id: string
          name: Json
          description: Json | null
          price: string
          category_id: string | null
          image_url: string | null
          image_width: number | null
          image_height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description?: Json | null
          price: string
          category_id?: string | null
          image_url?: string | null
          image_width?: number | null
          image_height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json | null
          price?: string
          category_id?: string | null
          image_url?: string | null
          image_width?: number | null
          image_height?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          title: Json
          description: Json | null
          image_url: string
          image_width: number | null
          image_height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: Json
          description?: Json | null
          image_url: string
          image_width?: number | null
          image_height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: Json
          description?: Json | null
          image_url?: string
          image_width?: number | null
          image_height?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: Json
          content: Json
          seo: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: Json
          content: Json
          seo?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: Json
          content?: Json
          seo?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          name: Json
          description: Json | null
          contact_info: Json
          opening_hours: Json
          social_media: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description?: Json | null
          contact_info: Json
          opening_hours: Json
          social_media: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json | null
          contact_info?: Json
          opening_hours?: Json
          social_media?: Json
          created_at?: string
          updated_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          name: Json
          description: Json
          price: string
          category: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description: Json
          price: string
          category: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json
          price?: string
          category?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

