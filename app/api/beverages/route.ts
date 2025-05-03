import { NextRequest, NextResponse } from "next/server"
import { 
  getBeverageCategories, 
  getBeverageItems, 
  getBeverageItemsByCategory
} from "@/lib/api" // Using our JSON API

// GET handler to fetch beverage categories and items
export async function GET(request: NextRequest) {
  try {
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

