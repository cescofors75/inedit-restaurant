import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"
import { 
  getMenuCategoriesFromSupabase, 
  getMenuItemsFromSupabase, 
  getMenuItemsByCategoryFromSupabase,
  createMenuCategoryInSupabase,
  updateMenuCategoryInSupabase,
  deleteMenuCategoryFromSupabase,
  createMenuItemInSupabase,
  updateMenuItemInSupabase,
  deleteMenuItemFromSupabase
} from "@/lib/supabase-menu" // Using Supabase

// Schema for validating menu category requests
const menuCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z.string().min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  description: z.string().optional(),
  locale: z.string().default("es").optional(),
})

// Schema for validating menu item requests
const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  price: z.string().min(1, "El precio es obligatorio"),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
  image: z.any().optional(),
  locale: z.string().default("es").optional(),
})

// GET handler to fetch menu categories and items
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
      // Get all menu categories
      const categories = await getMenuCategoriesFromSupabase(locale as string)
      return NextResponse.json(categories)
    } else if (type === 'items') {
      // Get menu items, optionally filtered by category
      if (categoryId) {
        // Get items for a specific category using our API function
        const items = await getMenuItemsByCategoryFromSupabase(categoryId, locale as string)
        return NextResponse.json(items)
      } else {
        // Get all items
        const items = await getMenuItemsFromSupabase(locale as string)
        return NextResponse.json(items)
      }
    } else {
      // Get both categories and items
      const [categories, items] = await Promise.all([
        getMenuCategoriesFromSupabase(locale as string),
        getMenuItemsFromSupabase(locale as string)
      ])
      
      return NextResponse.json({
        categories,
        items
      })
    }
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// POST handler to create a new menu category or item
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
        const { id, name, slug, description, locale, ...localizedData } = menuCategorySchema.parse(body);
        
        // Transform the data for the API function
        const localizedNames: Record<string, string> = { [locale || 'es']: name };
        const localizedDescriptions: Record<string, string> = description ? { [locale || 'es']: description } : {};
        
        // Create the category
        const newCategory = await createMenuCategoryInSupabase({
          slug,
          name: localizedNames,
          description: localizedDescriptions
        });

        if (!newCategory) {
          return NextResponse.json(
            { message: "Failed to create menu category" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: newCategory
        }, { status: 201 });
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
        const { id, name, description, price, categoryId, image, locale, ...localizedData } = menuItemSchema.parse(body);
        
        // Transform the data for the API function
        const localizedNames: Record<string, string> = { [locale || 'es']: name };
        const localizedDescriptions: Record<string, string> = description ? { [locale || 'es']: description } : {};
        
        // Create the item
        const newItem = await createMenuItemInSupabase({
          name: localizedNames,
          description: localizedDescriptions,
          price,
          category_id: categoryId,
          image_url: image
        });

        if (!newItem) {
          return NextResponse.json(
            { message: "Failed to create menu item" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: newItem
        }, { status: 201 });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return NextResponse.json(
          { message: "Invalid item data", error: validationError },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error creating menu item/category:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// PUT handler to update a menu category or item
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
        const { name, slug, description, locale, ...localizedData } = menuCategorySchema.parse(body);
        
        // Transform the data for the API function
        const updateData: any = {};
        
        if (slug) updateData.slug = slug;
        
        if (name) {
          updateData.name = { [locale || 'es']: name };
        }
        
        if (description !== undefined) {
          updateData.description = description ? { [locale || 'es']: description } : null;
        }
        
        // Update the category
        const updatedCategory = await updateMenuCategoryInSupabase(id, updateData);

        if (!updatedCategory) {
          return NextResponse.json(
            { message: "Failed to update menu category or category not found" },
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
        const { name, description, price, categoryId, image, locale, ...localizedData } = menuItemSchema.parse(body);
        
        // Transform the data for the API function
        const updateData: any = {};
        
        if (price) updateData.price = price;
        if (categoryId) updateData.category_id = categoryId;
        if (image !== undefined) updateData.image_url = image || null;
        
        if (name) {
          updateData.name = { [locale || 'es']: name };
        }
        
        if (description !== undefined) {
          updateData.description = description ? { [locale || 'es']: description } : null;
        }
        
        // Update the item
        const updatedItem = await updateMenuItemInSupabase(id, updateData);

        if (!updatedItem) {
          return NextResponse.json(
            { message: "Failed to update menu item or item not found" },
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
    console.error("Error updating menu item/category:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// DELETE handler to delete a menu category or item
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
      success = await deleteMenuCategoryFromSupabase(id);
    } else {
      // Delete the item
      success = await deleteMenuItemFromSupabase(id);
    }

    if (!success) {
      return NextResponse.json(
        { message: `Failed to delete menu ${type} or ${type} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Menu ${type} deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting menu item/category:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

