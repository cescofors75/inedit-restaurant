# INÈDIT Restaurant Website - Contentful CMS Integration

This guide explains how to set up and use the Contentful CMS integration for the INÈDIT Restaurant website. This integration allows for dynamic management of content including menu items, translations, gallery images, and SEO settings.

## Table of Contents

1. [Contentful Setup](#1-contentful-setup)
2. [Project Configuration](#2-project-configuration)
3. [Content Migration](#3-content-migration)
4. [Managing Content](#4-managing-content)
5. [Multilingual Support](#5-multilingual-support)
6. [SEO Optimization](#6-seo-optimization)
7. [Troubleshooting](#7-troubleshooting)

## 1. Contentful Setup

### Creating a Contentful Account and Space

1. Sign up for a Contentful account at [contentful.com](https://www.contentful.com/) if you don't have one already
2. Create a new space for the INÈDIT restaurant
3. Select "Empty space" when prompted for a template

### Setting Up Content Models

Create the following content models in Contentful:

#### Page

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `title` | Short text | Page title |
| `slug` | Short text | URL slug (e.g., "home", "menu") |
| `content` | Rich Text | Main page content |
| `seo` | Reference (to SEO Metadata) | SEO data for the page |

#### MenuCategory

| Field Name | Description | Field Type |
|------------|-------------|------------|
| `name` | Category name | Short text |
| `slug` | URL slug | Short text |
| `description` | Category description (optional) | Long text |
| `order` | Display order | Integer |

#### MenuItem

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `name` | Short text | Dish name |
| `description` | Long text | Dish description |
| `price` | Short text | Price (e.g., "15 €") |
| `category` | Reference (to MenuCategory) | Which category this item belongs to |
| `image` | Media (optional) | Photo of the dish |

#### GalleryImage

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `title` | Short text | Image title |
| `description` | Long text (optional) | Image description |
| `image` | Media | The gallery image |
| `featured` | Boolean | Whether to feature this image on the homepage |

#### Translation

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `key` | Short text | Translation key (e.g., "nav.home") |
| `value` | Short text | Translated text |

#### SEOMetadata

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `title` | Short text | Meta title |
| `description` | Long text | Meta description |
| `keywords` | Array (Short text) | Keywords for the page |
| `openGraph` | Object | Open Graph data with fields: `title`, `description`, `image` |
| `twitterCard` | Object | Twitter Card data with fields: `cardType`, `title`, `description`, `image` |
| `structuredData` | Object | Schema.org data for the restaurant |

For the `structuredData` object, include these fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `restaurantName` | Short text | Restaurant name |
| `restaurantUrl` | Short text | Website URL |
| `telephone` | Short text | Contact phone |
| `priceRange` | Short text | Price range (e.g., "€€€") |
| `servesCuisine` | Array (Short text) | Cuisine types |
| `openingHours` | Array (Short text) | Opening hours |
| `address` | Object | Physical address with fields: `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry` |
| `geo` | Object | Geographic coordinates with fields: `latitude`, `longitude` |

### Enabling Localization

1. In Contentful settings, go to "Settings" > "Locales"
2. Add the following locales:
   - Spanish (es) - Set as default
   - English (en)
   - Catalan (ca)
   - French (fr)
   - German (de)
3. Enable localization for all content models

### Getting API Keys

1. In Contentful, go to "Settings" > "API keys"
2. Create a new API key
3. Note down the "Space ID" and "Content Delivery API - access token"
4. Also note the "Content Preview API - access token" for preview functionality

## 2. Project Configuration

### Environment Variables

Create a `.env.local` file in the project root with the following:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_ENVIRONMENT=master
NEXT_PUBLIC_SITE_URL=https://ineditrestaurant.com
```

Replace the values with your actual Contentful credentials and your website URL.

### Installing Dependencies

Make sure all dependencies are installed:

```bash
pnpm install
```

### Starting the Development Server

Start the development server to test the CMS integration:

```bash
pnpm dev
```

Visit http://localhost:3000 to see your website. It should now be pulling content from Contentful.

## 3. Content Migration

### Menu Items and Categories

1. In Contentful, create menu categories first (e.g., Starters, Mains, Desserts)
2. For each category, set a name, slug, and order
3. Then create menu items, linking each to its respective category
4. Add descriptions, prices, and images for each item

### Translations

1. Review the existing translation keys in the `language-context.tsx` file
2. Create translation entries in Contentful for each key and each language
3. Example keys to include:
   - `nav.home`, `nav.menu`, `nav.gallery`, `nav.contact`
   - `hero.title`, `hero.subtitle`, `hero.cta`
   - `menu.title`, `menu.description`, `menu.no_items_in_category`
   - Other keys used throughout the website

### Pages

1. Create a "home" page with appropriate SEO metadata
2. Create pages for "menu", "gallery", "contact", and "reservation"
3. For each page, set:
   - Title and slug
   - Content using the rich text editor
   - SEO metadata reference

### Gallery Images

1. Upload images to the Contentful Media Library
2. Create gallery image entries linking to these uploaded images
3. Add titles and descriptions for each image
4. Mark featured images to appear on the homepage

## 4. Managing Content

### Menu Management

Best practices for managing menu items:

- Group menu items logically by categories
- Use consistent pricing formats (e.g., "15 €")
- Add high-quality images for featured dishes
- Keep descriptions concise but informative
- Update seasonal menus by changing item visibility rather than deleting items

### Content Updates

To update website content:

1. Log in to Contentful
2. Navigate to the content section
3. Find the entry you want to edit
4. Make your changes
5. Click "Publish" to make the changes live
6. The website will automatically update with the new content (may take a few minutes due to caching)

## 5. Multilingual Support

### Managing Translations

To manage translations effectively:

1. Always update all languages when adding new content
2. Use the Contentful interface to switch between languages
3. For translations, ensure the same `key` is used across all languages
4. Test the website in each language regularly

### URL Structure for Languages

The website uses query parameters for language selection:
- Spanish (default): `https://ineditrestaurant.com/`
- English: `https://ineditrestaurant.com/?lang=en`
- Catalan: `https://ineditrestaurant.com/?lang=ca`
- French: `https://ineditrestaurant.com/?lang=fr`
- German: `https://ineditrestaurant.com/?lang=de`

## 6. SEO Optimization

### Metadata Management

For optimal SEO:

1. Create a unique SEO Metadata entry for each page
2. Write compelling titles and descriptions
3. Include relevant keywords
4. Set up OpenGraph information for social media sharing
5. Configure Twitter Card data for Twitter sharing

### Structured Data

For the homepage, configure structured data with:

1. Accurate restaurant information
2. Correct address and geo-coordinates
3. Up-to-date opening hours
4. Correct price range
5. Appropriate cuisine types

### Sitemap and Robots.txt

The website automatically generates:
- A sitemap.xml file with all pages and language variations
- A robots.txt file allowing search engines to index the site

## 7. Troubleshooting

### Missing Content

If content is not appearing on the website:

1. Check that your content is published in Contentful
2. Verify that the content model matches the expected structure
3. Check for typos in field names or references
4. Look at the browser console for any errors
5. Restart the development server

### API Errors

If you see API errors:

1. Verify that your API keys are correct in the `.env.local` file
2. Check that the content delivery API is not rate-limited
3. Ensure that your Contentful space is active

### Preview Mode Issues

If preview mode isn't working:

1. Check that the preview token is set correctly
2. Verify that the preview URL is configured properly in Contentful
3. Ensure that the preview middleware is enabled in the Next.js configuration

## Additional Resources

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Contentful Content Modeling Guide](https://www.contentful.com/help/content-modelling-basics/)

