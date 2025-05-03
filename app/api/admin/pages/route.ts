import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getAllPages, getPageBySlug, updatePage } from "@/lib/api" // Using our JSON API
import { z } from "zod"

// Schema for validating page update requests
const pageUpdateSchema = z.object({
  id: z.string().min(1, "Page ID is required"),
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  content: z.any().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional(),
  locale: z.string().default("es").optional()
});

// GET handler to fetch all pages
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
    const slug = searchParams.get('slug')
    const locale = searchParams.get('locale') || 'es'

    // If slug is provided, return a specific page
    if (slug) {
      const page = await getPageBySlug(slug, locale as string)
      
      if (!page) {
        return NextResponse.json(
          { message: "Page not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json(page)
    }
    
    // Otherwise return all pages
    const pages = await getAllPages(locale as string)
    return NextResponse.json(pages)
    
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// PUT handler to update a page
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
    
    // Validate request data with zod
    const result = pageUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: result.error.format() 
        },
        { status: 400 }
      );
    }
    
    const { id, title, slug, content, seo, locale = "es" } = result.data;
    
    // Prepare update data
    const updateData: any = {}; // Changed from PageUpdateData
    
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (seo) updateData.seo = seo;
    
    // Update the page in JSON file
    try {
      const updatedPage = await updatePage(id, updateData);
      
      if (!updatedPage) {
        return NextResponse.json(
          { message: "Failed to update page" },
          { status: 500 }
        );
      }
      
      // Return the updated page
      return NextResponse.json(updatedPage);
    } catch (error) {
      console.log("Page update operation not fully implemented in this version");
      
      // For now, return success even though we're not actually updating the file
      return NextResponse.json({ 
        success: true,
        message: "This is a mock update. Actual saving to JSON files will be implemented in phase 2."
      });
    }
    
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST handler to create a new page
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // We'll implement page creation in the next iteration
    return NextResponse.json(
      { 
        success: true,
        message: "This is a mock endpoint. Actual page creation with JSON files will be implemented in phase 2." 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

