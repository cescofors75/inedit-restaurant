import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getGalleryImages } from "@/lib/api" // Using our JSON API
import { z } from "zod"

// Schema for validating image upload
const imageUploadSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  file: z.any(), // In a real implementation, this would validate the file
  tags: z.array(z.string()).optional(),
  locale: z.string().default("es").optional(),
})

// Schema for deleting an image
const imageDeleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
})

// GET handler to fetch gallery images
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
    const tag = searchParams.get('tag') // For filtering by tag
    const locale = searchParams.get('locale') || 'es'

    // Get gallery images
    const images = await getGalleryImages(locale as string)
    
    // Filter by tag if specified
    if (tag) {
      const filteredImages = images.filter(img => 
        img.tags && img.tags.includes(tag)
      )
      return NextResponse.json(filteredImages)
    }
    
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// POST handler to upload a new image
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
        message: "Image upload with JSON files functionality coming in phase 2" 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// DELETE handler to delete an image
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
        message: "Image deletion with JSON files functionality coming in phase 2" 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

