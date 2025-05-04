import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"
import { 
  getGalleryImagesFromSupabase, 
  uploadGalleryImageToSupabase, 
  deleteGalleryImageFromSupabase 
} from "@/lib/supabase-gallery"

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
    const locale = searchParams.get('locale') || 'es'

    // Get gallery images from Supabase
    const images = await getGalleryImagesFromSupabase(locale as string)
    
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

    // Parse the form data from the request
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const locale = formData.get('locale') as string || 'es';
    const imageFile = formData.get('file') as File;

    // Validate the required fields
    if (!title || !imageFile) {
      return NextResponse.json(
        { message: "Missing required fields: title and image file" },
        { status: 400 }
      );
    }

    // Create multilingual objects for title and description
    const titleMultilingual: Record<string, string> = {
      [locale]: title
    };

    const descriptionMultilingual: Record<string, string> | undefined = description 
      ? { [locale]: description }
      : undefined;

    // Todo: In a real implementation, upload the image to Supabase Storage
    // For now, we'll use a placeholder URL
    const imageUrl = `https://example.com/images/${imageFile.name}`;
    
    // Todo: Get actual image dimensions
    const imageWidth = 800;
    const imageHeight = 600;

    // Upload the gallery image to Supabase
    const newImage = await uploadGalleryImageToSupabase({
      title: titleMultilingual,
      description: descriptionMultilingual,
      image_url: imageUrl,
      image_width: imageWidth,
      image_height: imageHeight
    });

    if (!newImage) {
      return NextResponse.json(
        { message: "Failed to upload image to the database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      image: newImage
    });
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

    // Extract the image ID from the URL
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json(
        { message: "Image ID is required" },
        { status: 400 }
      );
    }

    // Delete the image from Supabase
    const success = await deleteGalleryImageFromSupabase(imageId);

    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete the image" },
        { status: 500 }
      );
    }

    // Todo: In a real implementation, also delete the image file from storage

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

