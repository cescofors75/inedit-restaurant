import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"
import { 
  getRestaurantSettingsFromSupabase,
  updateRestaurantSettingsInSupabase
} from "@/lib/supabase-api"

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

    // Get restaurant settings from Supabase
    const settings = await getRestaurantSettingsFromSupabase(locale as string)

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
    
    const validatedData = result.data;
    const locale = validatedData.locale || 'es';
    
    // Update settings in Supabase
    const updatedSettings = await updateRestaurantSettingsInSupabase({
      id: validatedData.id,
      name: validatedData.name,
      description: validatedData.description,
      contactInfo: validatedData.contactInfo,
      openingHours: validatedData.openingHours,
      socialMedia: validatedData.socialMedia
    });
    
    if (!updatedSettings) {
      return NextResponse.json(
        { message: "Failed to update settings" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSettings
    }, { status: 200 })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

