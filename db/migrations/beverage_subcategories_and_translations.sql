-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Modify Beverage Categories Table to support subcategories
ALTER TABLE beverage_categories 
ADD COLUMN parent_id UUID REFERENCES beverage_categories(id) ON DELETE CASCADE;

-- Add index for the new parent_id column
CREATE INDEX beverage_categories_parent_id_idx ON beverage_categories(parent_id);

-- 2. Create Translations Table for multilingual content
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,     -- e.g. 'menu_items', 'beverage_categories'
  column_name TEXT NOT NULL,    -- e.g. 'name', 'description'
  record_id UUID NOT NULL,      -- id of the record in the target table
  locale TEXT NOT NULL,         -- e.g. 'en', 'es', 'fr'
  content TEXT NOT NULL,        -- translated string content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (table_name, column_name, record_id, locale)
);

-- 3. Sample INSERT statements for beverage categories with subcategories

-- Main wine category
INSERT INTO beverage_categories (id, parent_id, slug, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000101', NULL, 'wine', 
   '{"en": "Wine", "es": "Vino"}', 
   '{"en": "All wines", "es": "Todos los vinos"}');

-- Wine subcategories
INSERT INTO beverage_categories (id, parent_id, slug, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000101', 'red-wine', 
   '{"en": "Red Wine", "es": "Vino Tinto"}', 
   '{"en": "Red wines", "es": "Vinos tintos"}'),
  
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000101', 'white-wine', 
   '{"en": "White Wine", "es": "Vino Blanco"}', 
   '{"en": "White wines", "es": "Vinos blancos"}'),
  
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000101', 'sparkling-wine', 
   '{"en": "Sparkling Wine", "es": "Vino Espumoso"}', 
   '{"en": "Sparkling wines and champagnes", "es": "Vinos espumosos y champañas"}'),
  
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000101', 'rose-wine', 
   '{"en": "Rosé Wine", "es": "Vino Rosado"}', 
   '{"en": "Rosé wines", "es": "Vinos rosados"}');

-- Sample beverage item in a subcategory
INSERT INTO beverage_items (name, description, price, category_id, image_url)
VALUES
  ('{"en": "Château Margaux 2015", "es": "Château Margaux 2015"}', 
   '{"en": "An exceptional Bordeaux with notes of blackberry and truffle", "es": "Un Burdeos excepcional con notas de mora y trufa"}',
   '120.00',
   '00000000-0000-0000-0000-000000000102',
   'https://example.com/images/chateau-margaux.jpg');

-- Sample translations for additional languages
INSERT INTO translations (table_name, column_name, record_id, locale, content)
VALUES
  -- French translation for Red Wine category name
  ('beverage_categories', 'name', '00000000-0000-0000-0000-000000000102', 'fr', 'Vin Rouge'),
  
  -- Italian translation for Red Wine category name
  ('beverage_categories', 'name', '00000000-0000-0000-0000-000000000102', 'it', 'Vino Rosso'),
  
  -- French translation for Château Margaux description
  ('beverage_items', 'description', (SELECT id FROM beverage_items WHERE (name->>'en') = 'Château Margaux 2015'), 'fr', 
   'Un Bordeaux exceptionnel avec des notes de mûre et de truffe');

