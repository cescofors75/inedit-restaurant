import fs from 'fs/promises';
import path from 'path';

const BASE_PATH = path.join(process.cwd(), 'public', 'data');

/**
 * Read data from a JSON file
 * @param {string} fileName - The name of the JSON file (without extension)
 * @returns {Promise<any>} - The parsed JSON data
 */
export async function getData(fileName) {
  try {
    const filePath = path.join(BASE_PATH, `${fileName}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}.json:`, error);
    return null;
  }
}

/**
 * Write data to a JSON file
 * @param {string} fileName - The name of the file (without extension)
 * @param {any} data - The data to write (will be stringified)
 * @returns {Promise<boolean>} - Success status
 */
export async function saveData(fileName, data) {
  try {
    const filePath = path.join(BASE_PATH, `${fileName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${fileName}.json:`, error);
    return false;
  }
}

/**
 * Get all pages from pages.json
 * @returns {Promise<Array<Object>>} - Array of page objects
 */
export async function getPages() {
  return getData('pages') || [];
}

/**
 * Save pages to pages.json
 * @param {Array<Object>} pages - Array of page objects
 * @returns {Promise<boolean>} - Success status
 */
export async function savePages(pages) {
  return saveData('pages', pages);
}

/**
 * Get a page by its slug
 * @param {string} slug - The page slug to find
 * @returns {Promise<Object|null>} - The page object or null if not found
 */
export async function getPageBySlug(slug) {
  const pages = await getPages();
  return pages.find(page => page.slug === slug) || null;
}

/**
 * Get all dishes from dishes.json
 * @returns {Promise<Array<Object>>} - Array of dish objects
 */
export async function getDishes() {
  return getData('dishes') || [];
}

/**
 * Save dishes to dishes.json
 * @param {Array<Object>} dishes - Array of dish objects
 * @returns {Promise<boolean>} - Success status
 */
export async function saveDishes(dishes) {
  return saveData('dishes', dishes);
}

/**
 * Get categories from categories.json
 * @returns {Promise<Array<Object>>} - Array of category objects
 */
export async function getCategories() {
  return getData('categories') || [];
}

/**
 * Save categories to categories.json
 * @param {Array<Object>} categories - Array of category objects
 * @returns {Promise<boolean>} - Success status
 */
export async function saveCategories(categories) {
  return saveData('categories', categories);
}

/**
 * Get gallery images from gallery.json
 * @returns {Promise<Array<Object>>} - Array of gallery image objects
 */
export async function getGalleryImages() {
  return getData('gallery') || [];
}

/**
 * Save gallery images to gallery.json
 * @param {Array<Object>} images - Array of gallery image objects
 * @returns {Promise<boolean>} - Success status
 */
export async function saveGalleryImages(images) {
  return saveData('gallery', images);
}

/**
 * Get settings from settings.json
 * @returns {Promise<Object>} - Settings object
 */
export async function getSettings() {
  return getData('settings') || {};
}

/**
 * Save settings to settings.json
 * @param {Object} settings - Settings object
 * @returns {Promise<boolean>} - Success status
 */
export async function saveSettings(settings) {
  return saveData('settings', settings);
}

/**
 * Get admin credentials from admin.json
 * @returns {Promise<Object>} - Admin credentials object
 */
export async function getAdminCredentials() {
  return getData('admin') || { username: 'admin', password: 'lloret2025' };
}

