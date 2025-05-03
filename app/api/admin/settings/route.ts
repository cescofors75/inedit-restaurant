import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getRestaurantSettings } from "@/lib/api" // Using our JSON API
import { z } from "zod"

// Schema for validating settings update requests
const contactInfoSchema = z.object({
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
})

const openingHourSchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().optional(),
})

const openingHoursSchema = z.object({
  monday: openingHourSchema.optional(),
  tuesday: openingHourSchema.optional(),
  wednesday: openingHourSchema.optional(),
  thursday: openingHourSchema.optional(),
  friday: openingHourSchema.optional(),
  saturday: openingHourSchema.optional(),
  sunday: openingHourSchema.optional(),
})

const socialMediaSchema = z.record(z.string().url("URL inválida"))

const settingsUpdateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().optional(),
  description: z.string().optional(),
  contactInfo: contactInfoSchema.optional(),
  openingHours: openingHoursSchema.optional(),
  socialMedia: socialMediaSchema.optional(),
  locale: z.string().default("es").optional(),
})

// GET handler to fetch restaurant settings
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

    // Get restaurant settings
    const settings = await getRestaurantSettings(locale as string)

    if (!settings) {
      return NextResponse.json(
        { message: "Settings not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// PUT handler to update restaurant settings
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
    const body = await request.json()
    
    // Validate request data with zod
    const result = settingsUpdateSchema.safeParse(body)
    
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
        message: "Update settings with JSON files functionality coming in phase 2" 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

