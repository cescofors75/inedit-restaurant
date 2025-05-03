import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { 
  getBeverageCategories, 
  getBeverageItems, 
  getBeverageItemsByCategory,
  createBeverageCategory,
  updateBeverageCategory,
  deleteBeverageCategory,
  createBeverageItem,
  updateBeverageItem,
  deleteBeverageItem
} from "@/lib/api" // Using our JSON API
import { z } from "zod"

// Schema for validating beverage category requests
const beverageCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  description: z.string().optional(),
  locale: z.string().default("es").optional(),
})

// Schema for validating beverage item requests
const beverageItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  price: z.string().min(1, "El precio es obligatorio"),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
  image: z.any().optional(),
  locale: z.string().default("es").optional(),
})

// GET handler to fetch beverage categories and items
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'categories', 'items', or null
    const categoryId = searchParams.get('categoryId') // For filtering items by category
    const locale = searchParams.get('locale') || 'es'

    // Fetch based on type parameter
    if (type === 'categories') {
      // Get all beverage categories
      const categories = await getBeverageCategories(locale as string)
      return NextResponse.json(categories)
    } else if (type === 'items') {
      // Get beverage items, optionally filtered by category
      if (categoryId) {
        // Get items for a specific category using our API function
        const items = await getBeverageItemsByCategory(categoryId, locale as string)
        return NextResponse.json(items)
      } else {
        // Get all items
        const items = await getBeverageItems(locale as string)
        return NextResponse.json(items)
      }
    } else {
      // Get both categories and items
      const [categories, items] = await Promise.all([
        getBeverageCategories(locale as string),
        getBeverageItems(locale as string)
      ])
      
      return NextResponse.json({
        categories,
        items
      })
    }
  } catch (error) {
    console.error("Error fetching beverage data:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// POST handler to create a new beverage category or item
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json();
    const { type } = body;

    if (!type || (type !== 'category' && type !== 'item')) {
      return NextResponse.json(
        { message: "Type must be 'category' or 'item'" },
        { status: 400 }
      );
    }

    if (type === 'category') {
      try {
        // Validate category data
        const { id, name, slug, description, locale, ...localizedData } = beverageCategorySchema.parse(body);
        
        // Transform the data for the API function
        const localizedNames: Record<string, string> = { [locale || 'es']: name };
        const localizedDescriptions: Record<string, string> = description ? { [locale || 'es']: description } : {};
        
        // Create the category
        const newCategory = await createBeverageCategory({
          slug,
          localizedNames,
          localizedDescriptions
        });

        if (!newCategory) {
          return NextResponse.json(
            { message: "Failed to create beverage category" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: newCategory
        });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return NextResponse.json(
          { message: "Invalid category data", error: validationError },
          { status: 400 }
        );
      }
    } else if (type === 'item') {
      try {
        // Validate item data
        const { id, name, description, price, categoryId, image, locale, ...localizedData } = beverageItemSchema.parse(body);
        
        // Transform the data for the API function
        const localizedNames: Record<string, string> = { [locale || 'es']: name };
        const localizedDescriptions: Record<string, string> = { [locale || 'es']: description || '' };
        
        // Create the item
        const newItem = await createBeverageItem({
          price,
          categoryId,
          image,
          localizedNames,
          localizedDescriptions
        });

        if (!newItem) {
          return NextResponse.json(
            { message: "Failed to create beverage item" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: newItem
        });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return NextResponse.json(
          { message: "Invalid item data", error: validationError },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error creating beverage item/category:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// PUT handler to update a beverage category or item
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json();
    const { type, id } = body;

    if (!type || (type !== 'category' && type !== 'item')) {
      return NextResponse.json(
        { message: "Type must be 'category' or 'item'" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    if (type === 'category') {
      try {
        // Validate category data
        const { name, slug, description, locale, ...localizedData } = beverageCategorySchema.parse(body);
        
        // Transform the data for the API function
        const updateData: any = {};
        
        if (slug) updateData.slug = slug;
        
        if (name) {
          updateData.localizedNames = { [locale || 'es']: name };
        }
        
        if (description) {
          updateData.localizedDescriptions = { [locale || 'es']: description };
        }
        
        // Update the category
        const updatedCategory = await updateBeverageCategory(id, updateData);

        if (!updatedCategory) {
          return NextResponse.json(
            { message: "Failed to update beverage category or category not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: updatedCategory
        });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return NextResponse.json(
          { message: "Invalid category data", error: validationError },
          { status: 400 }
        );
      }
    } else if (type === 'item') {
      try {
        // Validate item data
        const { name, description, price, categoryId, image, locale, ...localizedData } = beverageItemSchema.parse(body);
        
        // Transform the data for the API function
        const updateData: any = {};
        
        if (price) updateData.price = price;
        if (categoryId) updateData.categoryId = categoryId;
        if (image) updateData.image = image;
        
        if (name) {
          updateData.localizedNames = { [locale || 'es']: name };
        }
        
        if (description) {
          updateData.localizedDescriptions = { [locale || 'es']: description };
        }
        
        // Update the item
        const updatedItem = await updateBeverageItem(id, updateData);

        if (!updatedItem) {
          return NextResponse.json(
            { message: "Failed to update beverage item or item not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: updatedItem
        });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return NextResponse.json(
          { message: "Invalid item data", error: validationError },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error updating beverage item/category:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a beverage category or item
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse the URL to get query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is required" },
        { status: 400 }
      );
    }

    if (!type || (type !== 'category' && type !== 'item')) {
      return NextResponse.json(
        { message: "Type parameter must be 'category' or 'item'" },
        { status: 400 }
      );
    }

    let success: boolean;

    if (type === 'category') {
      // Delete the category
      success = await deleteBeverageCategory(id);
    } else {
      // Delete the item
      success = await deleteBeverageItem(id);
    }

    if (!success) {
      return NextResponse.json(
        { message: `Failed to delete beverage ${type} or ${type} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Beverage ${type} deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting beverage item/category:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
