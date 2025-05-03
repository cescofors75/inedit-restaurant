import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth";
import { getTranslations } from "@/lib/api"; // Using our JSON file API
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

    // Get translations for the specified locale
    const translations = await getTranslations(locale)
    
    return NextResponse.json(translations)
  } catch (error) {
    console.error(`Error fetching translations:`, error)
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
    
    // For now, return a not implemented response
    // This will be updated once we implement JSON file update functionality
    return NextResponse.json(
      { 
        success: true,
        message: "Update translations with JSON files functionality coming in phase 2" 
      },
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

