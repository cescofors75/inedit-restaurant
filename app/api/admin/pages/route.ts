import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { z } from "zod"
import { 
  getPagesFromSupabase, 
  getPageBySlugFromSupabase,
  createPageInSupabase,
  updatePageInSupabase,
  deletePageFromSupabase 
} from "@/lib/supabase-pages"

// Custom HTTPError class
class HTTPError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "HTTPError";
  }
}

// Schema for validating page update requests
const pageUpdateSchema = z.object({
  id: z.string().min(1, "Page ID is required"),
  title: z.record(z.string()).optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  content: z.record(z.any()).optional(),
  seo: z.object({
    title: z.record(z.string()).optional(),
    description: z.record(z.string()).optional(),
    keywords: z.array(z.string()).optional()
  }).optional().nullable(),
  locale: z.string().default("es").optional()
});

// Schema for validating page creation requests
const pageCreateSchema = z.object({
  title: z.record(z.string()),
  slug: z.string().min(1, "Slug is required"),
  content: z.record(z.any()),
  seo: z.object({
    title: z.record(z.string()).optional(),
    description: z.record(z.string()).optional(),
    keywords: z.array(z.string()).optional()
  }).optional(),
  locale: z.string().default("es").optional()
});

// GET handler to fetch all pages or a specific page by slug
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
      const page = await getPageBySlugFromSupabase(slug, locale as string)
      
      if (!page) {
        return NextResponse.json(
          { message: "Page not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json(page)
    }
    
    // Otherwise return all pages
    const pages = await getPagesFromSupabase(locale as string)
    return NextResponse.json(pages)
    
  } catch (error: any) {
    console.error("Error fetching pages:", error)
    const message = error instanceof HTTPError ? error.message : "An unexpected error occurred";
    const status = error instanceof HTTPError ? error.status : 500;
    return NextResponse.json(
      { message: message },
      { status: status }
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

    // Parse request body
    const body = await request.json();
    
    // Validate request data with zod
    const result = pageCreateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: result.error.format() 
        },
        { status: 400 }
      );
    }
    
    const { title, slug, content, seo } = result.data;
    
    // Create the page in Supabase
    const newPage = await createPageInSupabase({
      title,
      slug,
      content,
      seo
    });
    
    if (!newPage) {
      return NextResponse.json(
        { message: "Failed to create page. The slug may already be in use." },
        { status: 500 }
      );
    }
    
    // Return the newly created page
    return NextResponse.json(newPage, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating page:", error);
    const message = error instanceof HTTPError ? error.message : "An unexpected error occurred";
    const status = error instanceof HTTPError ? error.status : 500;
    return NextResponse.json(
      { message: message },
      { status: status }
    );
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
    
    const { id, title, slug, content, seo } = result.data;
    
    // Prepare update data
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    // Handle seo field which can be null to remove it
    if (seo !== undefined) updateData.seo = seo;
    
    // Update the page in Supabase
    const updatedPage = await updatePageInSupabase(id, updateData);
    
    if (!updatedPage) {
      return NextResponse.json(
        { message: "Failed to update page. The page may not exist or the slug is already in use." },
        { status: 500 }
      );
    }
    
    // Return the updated page
      return NextResponse.json(updatedPage);
    
  } catch (error: any) {
    console.error("Error updating page:", error);
    const message = error instanceof HTTPError ? error.message : "An unexpected error occurred";
    const status = error instanceof HTTPError ? error.status : 500;
    return NextResponse.json(
      { message: message },
      { status: status }
    );
  }
}

// DELETE handler to delete a page
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: "Page ID is required" },
        { status: 400 }
      )
    }
    
    // Delete the page from Supabase
    const success = await deletePageFromSupabase(id);
    
    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete page" },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Page deleted successfully" 
    });
    
  } catch (error: any) {
    console.error("Error deleting page:", error);
    const message = error instanceof HTTPError ? error.message : "An unexpected error occurred";
    const status = error instanceof HTTPError ? error.status : 500;
    return NextResponse.json(
      { message: message },
      { status: status }
    );
  }
}

