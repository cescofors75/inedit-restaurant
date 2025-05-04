import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth";
import { 
  getTranslationsFromSupabase, 
  updateTranslationsInSupabase, 
  deleteTranslationKeyFromSupabase 
} from "@/lib/supabase-translations";
import { z } from "zod";

// Schema for validating translation updates
const translationUpdateSchema = z.object({
  locale: z.string().min(1, "Locale is required"),
  translations: z.record(z.string()),
})

// GET handler to fetch translations
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
    const locale = searchParams.get('locale') || 'es'

    // Get translations for the specified locale from Supabase
    const translations = await getTranslationsFromSupabase(locale)
    
    if (translations === null) {
      return NextResponse.json(
        { message: "Failed to fetch translations" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(translations)
  } catch (error) {
    console.error(`Error fetching translations:`, error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// DELETE handler to delete a translation key across all locales
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the key to delete from query parameters
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { message: "Translation key is required" },
        { status: 400 }
      )
    }
    
    // Delete the translation key from Supabase
    const success = await deleteTranslationKeyFromSupabase(key)
    
    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete translation key" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Translation key deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting translation key:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
// PUT handler to update translations
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = translationUpdateSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: result.error.format() 
        },
        { status: 400 }
      )
    }
    
    const { locale, translations } = result.data
    
    // Update translations in Supabase
    const success = await updateTranslationsInSupabase(locale, translations)
    
    if (!success) {
      return NextResponse.json(
        { message: "Failed to update translations" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Translations updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating translations:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

