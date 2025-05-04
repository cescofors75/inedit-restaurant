# Supabase Migration Plan - Pages Module

## Overview
We've successfully migrated the admin/pages module from JSON file-based storage to Supabase. This migration enables persistent database storage for pages with proper relational data management, improved performance, and better scalability.

## Implementation Details

### 1. New Supabase Integration File
- Created `lib/supabase-pages.ts` with full CRUD operations:
  - `getPagesFromSupabase()` - Retrieves all pages with localization support
  - `getPageBySlugFromSupabase()` - Fetches a specific page by its slug
  - `createPageInSupabase()` - Creates new pages with validation
  - `updatePageInSupabase()` - Updates existing pages with conflict checking
  - `deletePageFromSupabase()` - Removes pages with proper cleanup

### 2. API Route Modernization
- Updated `app/api/admin/pages/route.ts` to use the new Supabase functions:
  - Replaced JSON file operations with Supabase database operations
  - Implemented comprehensive RESTful API endpoints (GET, POST, PUT, DELETE)
  - Added robust validation with Zod schemas
  - Improved error handling and status code responses

### 3. Data Structure
The pages are stored in Supabase with this structure:
```
pages: {
  id: string;            // UUID for the page
  slug: string;          // URL-friendly identifier
  title: Json;           // Multilingual titles as JSON
  content: Json;         // Page content as structured JSON
  seo: Json | null;      // Optional SEO metadata
  created_at: string;    // Creation timestamp
  updated_at: string;    // Last update timestamp
}
```

### 4. Key Benefits
- **Database Persistence**: Pages are now stored in a reliable PostgreSQL database
- **Multilingual Support**: Full support for localized content with structured JSON fields
- **Improved Performance**: More efficient data retrieval with database queries
- **Better Security**: Using service role clients for admin operations
- **API Compatibility**: Front-end components continue working without changes

## Next Steps

1. **Data Migration**: Consider migrating existing JSON page data to Supabase
2. **SEO Improvements**: Expand SEO functionality with additional metadata fields
3. **Rich Text Editor**: Implement a rich text editor for the content field
4. **Image Management**: Add support for embedding images within page content
5. **Versioning**: Consider adding page versioning for content history

## Testing Recommendations

1. Test creating new pages through the admin interface
2. Verify that existing pages continue to display correctly
3. Confirm that page updates are persisted properly
4. Check that multilingual content works as expected
5. Verify that SEO metadata is properly saved and retrieved

# Comprehensive Plan for Migrating from JSON Files to Supabase Database

## 1. Setting up Supabase

### 1.1 Create a Supabase Project
1. Sign up at [supabase.io](https://supabase.io)
2. Create a new project
3. Save the URL and API keys

### 1.2 Install the Supabase client in your project
```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### 1.3 Set up environment variables
Add the following to your `.env.local` file:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## 2. Database Schema Design

Based on your existing JSON structure, here's the SQL schema for your Supabase database:

### 2.1 Menu Categories Table

```sql
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name JSONB NOT NULL,
  description JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups by slug
CREATE INDEX menu_categories_slug_idx ON menu_categories(slug);
```

### 2.2 Menu Items Table

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name JSONB NOT NULL,
  description JSONB,
  price TEXT NOT NULL,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  image_width INTEGER,
  image_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups by category
CREATE INDEX menu_items_category_idx ON menu_items(category_id);
```

### 2.3 Beverage Categories Table

```sql
CREATE TABLE beverage_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name JSONB NOT NULL,
  description JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups by slug
CREATE INDEX beverage_categories_slug_idx ON beverage_categories(slug);
```

### 2.4 Beverage Items Table

```sql
CREATE TABLE beverage_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name JSONB NOT NULL,
  description JSONB,
  price TEXT NOT NULL,
  category_id UUID REFERENCES beverage_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  image_width INTEGER,
  image_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups by category
CREATE INDEX beverage_items_category_idx ON beverage_items(category_id);
```

### 2.5 Gallery Images Table

```sql
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL,
  description JSONB,
  image_url TEXT NOT NULL,
  image_width INTEGER,
  image_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 2.6 Pages Table

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title JSONB NOT NULL,
  content JSONB NOT NULL,
  seo JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups by slug
CREATE INDEX pages_slug_idx ON pages(slug);
```

### 2.7 Settings Table

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name JSONB NOT NULL,
  description JSONB,
  contact_info JSONB NOT NULL,
  opening_hours JSONB NOT NULL,
  social_media JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 3. Client Setup and Configuration

### 3.1 Create a Supabase client utility

Create a new file `/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public facing operations (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations that need more privileges
// Only use this on the server, never expose the service key to the client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper function for getting the appropriate client based on context
export function getSupabase(useAdmin = false) {
  return useAdmin ? supabaseAdmin : supabase;
}
```

## 4. Data Models and Access Layer Updates

### 4.1 Update the API interfaces in `/lib/api.ts`:

```typescript
// lib/api.ts
import 'server-only';
import { getSupabase } from './supabase';

// (Existing interfaces can largely remain the same)

// Helper function to get localized value
function getLocalizedValue(obj: Record<string, string> | string, locale: string): string {
  if (typeof obj === 'string') return obj;
  return obj[locale] || obj['en'] || '';
}

// Updated API functions
export async function getPageBySlug(slug: string, locale = 'es'): Promise<Page | null> {
  const supabase = getSupabase(true);
  
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error || !data) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    title: getLocalizedValue(data.title, locale),
    slug: data.slug,
    content: data.content ? Object.fromEntries(
      Object.entries(data.content).map(([key, value]) => [key, getLocalizedValue(value as any, locale)])
    ) : {},
    seo: data.seo ? {
      title: getLocalizedValue(data.seo.title, locale),
      description: getLocalizedValue(data.seo.description, locale),
      keywords: data.seo.keywords
    } : undefined,
    updatedAt: data.updated_at
  };
}

export async function getAllPages(locale = 'es'): Promise<Page[]> {
  const supabase = getSupabase(true);
  
  const { data, error } = await supabase
    .from('pages')
    .select('*');
    
  if (error || !data) {
    console.error('Error fetching all pages:', error);
    return [];
  }
  
  return data.map(page => ({
    id: page.id,
    title: getLocalizedValue(page.title, locale),
    slug: page.slug,
    updatedAt: page.updated_at
  }));
}

export async function getMenuCategories(locale = 'es'): Promise<MenuCategory[]> {
  const supabase = getSupabase(true);
  
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*');
    
  if (error || !data) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
  
  return data.map(category => ({
    id: category.id,
    name: getLocalizedValue(category.name, locale),
    slug: category.slug,
    description: category.description ? getLocalizedValue(category.description, locale) : undefined
  }));
}

export async function getMenuItems(locale = 'es'): Promise<MenuItem[]> {
  const supabase = getSupabase(true);
  
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');
    
  if (error || !data) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    name: getLocalizedValue(item.name, locale),
    description: getLocalizedValue(item.description, locale),
    price: item.price,
    categoryId: item.category_id,
    image: item.image_url ? {
      url: item.image_url,
      width: item.image_width || 800,
      height: item.image_height || 600
    } : undefined
  }));
}

export async function getMenuItemsByCategory(categoryId: string, locale = 'es'): Promise<MenuItem[]> {
  const supabase = getSupabase(true);
  
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId);
    
  if (error || !data) {
    console.error(`Error fetching menu items for category ${categoryId}:`, error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    name: getLocalizedValue(item.name, locale),
    description: getLocalizedValue(item.description, locale),
    price: item.price,
    categoryId: item.category_id,
    image: item.image_url ? {
      url: item.image_url,
      width: item.image_width || 800,
      height: item.image_height || 600
    } : undefined
  }));
}

// Create/Update/Delete functions for Beverage Categories
export async function createBeverageCategory(newCategory: Omit<BeverageCategory, 'id'> & { localizedNames: Record<string, string>, localizedDescriptions?: Record<string, string> }): Promise<BeverageCategory | null> {
  const supabase = getSupabase(true);
  
  const { data, error } = await supabase
    .from('beverage_categories')
    .insert({
      slug: newCategory.slug,
      name: newCategory.localizedNames,
      description: newCategory.localizedDescriptions || {}
    })
    .select()
    .single();
    
  if (error || !data) {
    console.error('Error creating beverage category:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: newCategory.localizedNames.en || Object.values(newCategory.localizedNames)[0] || '',
    slug: data.slug,
    description: newCategory.localizedDescriptions?.en
  };
}

export async function updateBeverageCategory(categoryId: string, updateData: Partial<BeverageCategory> & { localizedNames?: Record<string, string>, localizedDescriptions?: Record<string, string> }): Promise<BeverageCategory | null> {
  const supabase = getSupabase(true);
  
  // First get the current data
  const { data: currentCategory, error: fetchError } = await supabase
    .from('beverage_categories')
    .select('*')
    .eq('id', categoryId)
    .single();
    
  if (fetchError || !currentCategory) {
    console.error(`Error fetching beverage category ${categoryId}:`, fetchError);
    return null;
  }
  
  // Prepare update data
  const updatePayload: any = {};
  
  if (updateData.localizedNames) {
    updatePayload.name = { ...currentCategory.name, ...updateData.localizedNames };
  }
  
  if (updateData.localizedDescriptions) {
    updatePayload.description = { ...currentCategory.description || {}, ...updateData.localizedDescriptions };
  }
  
  if (updateData.slug) {
    updatePayload.slug = updateData.slug;
  }
  
  // Only update if we have changes
  if (Object.keys(updatePayload).length === 0) {
    return {
      id: currentCategory.id,
      name: currentCategory.name.en || Object.values(currentCategory.name)[0] || '',
      slug: currentCategory.slug,
      description: currentCategory.description?.en
    };
  }
  
  // Perform the update
  const { data, error } = await supabase
    .from('beverage_categories')
    .update(updatePayload)
    .eq('id', categoryId)
    .select()
    .single();
    
  if (error || !data) {
    console.error(`Error updating beverage category ${categoryId}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name.en || Object.values(data.name)[0] || '',
    slug: data.slug,
    description: data.description?.en
  };
}

export async function deleteBeverageCategory(categoryId: string): Promise<boolean> {
  const supabase = getSupabase(true);
  
  // First clear the category reference from any items
  const { error: updateError } = await supabase
    .from('beverage_items')
    .update({ category_id: null })
    .eq('category_id', categoryId);
    
  if (updateError) {
    console.error(`Error clearing category references for ${categoryId}:`, updateError);
    return false;
  }
  
  // Then delete the category
  const { error } = await supabase
    .from('beverage_categories')
    .delete()
    .eq('id', categoryId);
    
  if (error) {
    console.error(`Error deleting beverage category ${categoryId}:`, error);
    return false;
  }
  
  return true;
}

// Similar updates for other CRUD operations...
```

### 4.2 Update `/app/lib/data.js`:

```javascript
// app/lib/data.js
import { createClient } from '@supabase/supabase-js';

// Get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Always use service role in server components
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Get all pages
 * @returns {Promise<Array<Object>>} - Array of page objects
 */
export async function getPages() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('pages')
    .select('*');
    
  if (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Save pages to pages table
 * @param {Array<Object>} pages - Array of page objects
 * @returns {Promise<boolean>} - Success status
 */
export async function savePages(pages) {
  const supabase = getSupabaseClient();
  
  // First delete existing pages
  const { error: deleteError } = await supabase
    .from('pages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to delete all
    
  if (deleteError) {
    console.error('Error deleting existing pages:', deleteError);
    return false;
  }
  
  // Then insert new pages
  const { error: insertError } = await supabase
    .from('pages')
    .insert(pages);
    
  if (insertError) {
    console.error('Error inserting pages:', insertError);
    return false;
  }
  
  return true;
}

/**
 * Get a page by its slug
 * @param {string} slug - The page slug to find
 * @returns {Promise<Object|null>} - The page object or null if not found
 */
export async function getPageBySlug(slug) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

/**
 * Get all dishes
 * @returns {Promise<Array<Object>>} - Array of dish objects
 */
export async function getDishes() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('dishes')
    .select('*');
    
  if (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Save dishes
 * @param {Array<Object>} dishes - Array of dish objects
 * @returns {Promise<boolean>} - Success status
 */
export async function saveDishes(dishes) {
  const supabase = getSupabaseClient();
  
  // First delete existing dishes
  const { error: deleteError } = await supabase
    .from('dishes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to delete all
    
  if (deleteError) {
    console.error('Error deleting existing dishes:', deleteError);
    return false;
  }
  
  // Then insert new dishes
  const { error: insertError } = await supabase
    .from('dishes')
    .insert(dishes);
    
  if (insertError) {
    console.error('Error inserting dishes:', insertError);
    return false;
  }
  
  return true;
}

// Similarly implement getCategories(), saveCategories(), getGalleryImages(), etc.
// following the same pattern of using Supabase queries instead of file operations

/**
 * Get settings
 * @returns {Promise<Object>} - Settings object
 */
export async function getSettings() {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .maybeSingle(); // Use maybeSingle to get null if no settings exist
    
  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
  
  return data || {};
}

/**
 * Save settings
 * @param {Object} settings - Settings object
 * @returns {Promise<boolean>} - Success status
 */
export async function saveSettings(settings) {
  const supabase = getSupabaseClient();
  
  // Check if settings already exist
  const { data, error: fetchError } = await supabase
    .from('settings')
    .select('id')
    .maybeSingle();
    
  if (fetchError) {
    console.error('Error checking existing settings:', fetchError);
    return false;
  }
  
  if (data) {
    // Update existing settings
    const { error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', data.id);
      
    if (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  } else {
    // Insert new settings
    const { error } = await supabase
      .from('settings')
      .insert(settings);
      
    if (error) {
      console.error('Error inserting settings:', error);
      return false;
    }
  }
  
  return true;
}
```

## 5. Authentication Integration

### 5.1 Update `/lib/auth.ts` to use Supabase Auth

```typescript
// lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Get Supabase client (server-side)
function getSupabaseServer() {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// Function to authenticate admin
export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return !error;
}

// Set authentication cookie - Not needed with Supabase as it handles cookies
export async function setAuthCookie() {
  // Supabase manages cookies automatically
  return true;
}

// Check if admin is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return false;
  }
  
  return true;
}

// Clear authentication cookie (for logout)
export async function clearAuthCookie() {
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
}

// Middleware to protect admin routes
export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }
}
```

### 5.2 Update API Routes for Authentication

Replace `/app/api/admin/login/route.js` with:

```javascript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
```

Replace `/app/api/admin/logout/route.js` with:

```javascript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    await supabase.auth.signOut();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
```

## 6. Data Migration Script

Create a new file `/scripts/migrate-to-supabase.js` to migrate data from JSON files to Supabase:

```javascript
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Path to JSON data files
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// Helper to read JSON files
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

// Migration functions for each data type
async function migrateMenuCategories() {
  console.log('Migrating menu categories...');
  const menuData = await readJsonFile('menu.json');
  
  if (!menuData || !menuData.categories || !menuData.categories.length) {
    console.log('No menu categories to migrate');
    return;
  }
  
  // Prepare data for insertion
  const categories = menuData.categories.map(category => ({
    id: category.id, // Preserve original IDs
    slug: category.slug,
    name: category.name,
    description: category.description || {}
  }));
  
  // Insert categories into Supabase
  const { error } = await supabase.from('menu_categories').upsert(categories);
  
  if (error) {
    console.error('Error migrating menu categories:', error);
    return false;
  }
  
  console.log(`Successfully migrated ${categories.length} menu categories`);
  return true;
}

async function migrateMenuItems() {
  console.log('Migrating menu items...');
  const menuData = await readJsonFile('menu.json');
  
  if (!menuData || !menuData.items || !menuData.items.length) {
    console.log('No menu items to migrate');
    return;
  }
  
  // Prepare data for insertion
  const items = menuData.items.map(item => ({
    id: item.id, // Preserve original IDs
    name: item.name,
    description: item.description,
    price: item.price,
    category_id: item.categoryId,
    image_url: item.image || null,
    image_width: 800, // Default width
    image_height: 600 // Default height
  }));
  
  // Insert items into Supabase
  const { error } = await supabase.from('menu_items').upsert(items);
  
  if (error) {
    console.error('Error migrating menu items:', error);
    return false;
  }
  
  console.log(`Successfully migrated ${items.length} menu items`);
  return true;
}

async function migrateBeverageCategories() {
  console.log('Migrating beverage categories...');
  const beverageData = await readJsonFile('beverages.json');
  
  if (!beverageData || !beverageData.categories || !beverageData.categories.length) {
    console.log('No beverage categories to migrate');
    return;
  }
  
  // Prepare data for insertion
  const categories = beverageData.categories.map(category => ({
    id: category.id, // Preserve original IDs
    slug: category.slug,
    name: category.name,
    description: category.description || {}
  }));
  
  // Insert categories into Supabase
  const { error } = await supabase.from('beverage_categories').upsert(categories);
  
  if (error) {
    console.error('Error migrating beverage categories:', error);
    return false;
  }
  
  console.log(`Successfully migrated ${categories.length} beverage categories`);
  return true;
}

async function migrateBeverageItems() {
  console.log('Migrating beverage items...');
  const beverageData = await readJsonFile('beverages.json');
  
  if (!beverageData || !beverageData.items || !beverageData.items.length) {
    console.log('No beverage items to migrate');
    return;
  }
  
  // Prepare data for insertion
  const items = beverageData.items.map(item => ({
    id: item.id, // Preserve original IDs
    name: item.name,
    description: item.description,
    price: item.price,
    category_id: item.categoryId,
    image_url: item.image || null,
    image_width: 800, // Default width
    image_height: 600 // Default height
  }));
  
  // Insert items into Supabase
  const { error } = await supabase.from('beverage_items').upsert(items);
  
  if (error) {
    console.error('Error migrating beverage items:', error);
    return false;
  }
  
  console.log(`Successfully migrated ${items.length} beverage items`);
  return true;
}

async function migrateGalleryImages() {
  console.log('Migrating gallery images...');
  const galleryData = await readJsonFile('gallery.json');
  
  if (!galleryData || !galleryData.images || !galleryData.images.length) {
    console.log('No gallery images to migrate');
    return;
  }
  
  // Prepare data for insertion
  const images = galleryData.images.map(image => ({
    id: image.id, // Preserve original IDs
    title: image.title,
    description: image.description || {},
    image_url: image.image,
    image_width: 1200, // Default width
    image_height: 800 // Default height
  }));
  
  // Insert images into Supabase
  const { error } = await supabase.from('gallery_images').upsert(images);
  
  if (error) {
    console.error('Error migrating gallery images:', error);
    return false;
  }
  
  console.log(`Successfully migrated ${images.length} gallery images`);
  return true;
}

async function migratePages() {
  console.log('Migrating pages...');
  const pagesData = await readJsonFile('pages.json');
  
  if (!pagesData) {
    console.log('No pages to migrate');
    return;
  }
  
  // Convert from object structure to array
  const pages = Object.entries(pagesData).map(([slug, pageData]) => ({
    id: pageData.id, // Preserve original IDs
    slug,
    title: pageData.title,
    content: pageData.content || {},
    seo: pageData.seo || null
  }));
  
  // Insert pages into Supabase
  const { error } = await supabase.from('pages').upsert(pages);
  
  if (error) {
    console.error('Error migrating pages:', error);
    return false;
  }
  
  console.log(`Successfully migrated ${pages.length} pages`);
  return true;
}

async function migrateSettings() {
  console.log('Migrating settings...');
  const settingsData = await readJsonFile('settings.json');
  
  if (!settingsData) {
    console.log('No settings to migrate');
    return;
  }
  
  // Prepare data for insertion
  const settings = {
    id: settingsData.id || 'settings_default',
    name: settingsData.name,
    description: settingsData.description || {},
    contact_info: settingsData.contactInfo,
    opening_hours: settingsData.openingHours,
    social_media: settingsData.socialMedia
  };
  
  // Insert settings into Supabase
  const { error } = await supabase.from('settings').upsert(settings);
  
  if (error) {
    console.error('Error migrating settings:', error);
    return false;
  }
  
  console.log('Successfully migrated settings');
  return true;
}

async function migrateAdmin() {
  console.log('Migrating admin user...');
  const adminData = await readJsonFile('admin.json');
  
  if (!adminData || !adminData.username) {
    console.log('No admin data to migrate');
    return;
  }
  
  // Use Supabase Auth to create an admin user
  // We'll convert the username to an email format if it's not already
  const email = adminData.username.includes('@') 
    ? adminData.username 
    : `${adminData.username}@inedit-restaurant.com`;
  
  const { error } = await supabase.auth.admin.createUser({
    email,
    password: adminData.password,
    email_confirm: true
  });
  
  if (error) {
    console.error('Error migrating admin user:', error);
    return false;
  }
  
  console.log('Successfully migrated admin user');
  return true;
}

// Run all migration functions
async function runMigration() {
  console.log('Starting migration from JSON files to Supabase...');
  
  // Run migrations in sequence
  await migrateMenuCategories();
  await migrateMenuItems();
  await migrateBeverageCategories();
  await migrateBeverageItems();
  await migrateGalleryImages();
  await migratePages();
  await migrateSettings();
  await migrateAdmin();
  
  console.log('Migration completed!');
}

// Execute migration
runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
```

To run the migration script:

```bash
# Install dotenv if not already installed
npm install dotenv

# Run the migration script
node scripts/migrate-to-supabase.js
```

## 7. Testing and Verification

After completing the migration, follow these steps to test and verify that everything is working correctly:

### 7.1 Database Verification

1. **Check data integrity in Supabase**:
   - Log in to the Supabase dashboard
   - Navigate to the "Table Editor" section
   - Verify each table contains the expected number of records
   - Check that relationships are properly established (e.g., menu items link to correct categories)
   - Confirm multilingual content is preserved in JSONB fields

2. **Run count verification queries**:
   ```javascript
   // Create a verification script (verify-migration.js)
   import { createClient } from '@supabase/supabase-js';
   import dotenv from 'dotenv';
   import fs from 'fs/promises';
   import path from 'path';
   
   dotenv.config({ path: '.env.local' });
   
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.SUPABASE_SERVICE_ROLE_KEY
   );
   
   const DATA_DIR = path.join(process.cwd(), 'public', 'data');
   
   async function readJsonFile(filename) {
     try {
       const filePath = path.join(DATA_DIR, filename);
       const data = await fs.readFile(filePath, 'utf8');
       return JSON.parse(data);
     } catch (error) {
       console.error(`Error reading ${filename}:`, error);
       return null;
     }
   }
   
   async function verifyCount(tableName, jsonFile, countAccessor) {
     const jsonData = await readJsonFile(jsonFile);
     const jsonCount = countAccessor(jsonData);
     
     const { count: dbCount, error } = await supabase
       .from(tableName)
       .select('*', { count: 'exact', head: true });
     
     if (error) {
       console.error(`Error counting ${tableName}:`, error);
       return false;
     }
     
     console.log(`${tableName}: JSON count = ${jsonCount}, DB count = ${dbCount}`);
     return jsonCount === dbCount;
   }
   
   async function runVerification() {
     // Verify menu categories
     await verifyCount('menu_categories', 'menu.json', data => data.categories.length);
     
     // Verify menu items
     await verifyCount('menu_items', 'menu.json', data => data.items.length);
     
     // Verify beverage categories
     await verifyCount('beverage_categories', 'beverages.json', data => data.categories.length);
     
     // Verify beverage items
     await verifyCount('beverage_items', 'beverages.json', data => data.items.length);
     
     // Verify gallery images
     await verifyCount('gallery_images', 'gallery.json', data => data.images.length);
     
     // Verify pages
     await verifyCount('pages', 'pages
