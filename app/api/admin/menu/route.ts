import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getMenuCategories, getMenuItems, getMenuItemsByCategory } from "@/lib/api" // Using our JSON API
import { z } from "zod"

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
      const categories = await getMenuCategories(locale as string)
      return NextResponse.json(categories)
    } else if (type === 'items') {
      // Get menu items, optionally filtered by category
      if (categoryId) {
        // Get items for a specific category using our API function
        const items = await getMenuItemsByCategory(categoryId, locale as string)
        return NextResponse.json(items)
      } else {
        // Get all items
        const items = await getMenuItems(locale as string)
        return NextResponse.json(items)
      }
    } else {
      // Get both categories and items
      const [categories, items] = await Promise.all([
        getMenuCategories(locale as string),
        getMenuItems(locale as string)
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

    // For now, return a not implemented response
    return NextResponse.json(
      { 
        success: true,
        message: "Create menu item/category with JSON files functionality coming in phase 2" 
      },
      { status: 200 }
    )
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

    // For now, return a not implemented response
    return NextResponse.json(
      { 
        success: true,
        message: "Update menu item/category with JSON files functionality coming in phase 2" 
      },
      { status: 200 }
    )
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

    // For now, return a not implemented response
    return NextResponse.json(
      { 
        success: true,
        message: "Delete menu item/category with JSON files functionality coming in phase 2" 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting menu item/category:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

