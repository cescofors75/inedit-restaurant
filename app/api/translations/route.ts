import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';

    // Get translations for the specified locale
    const translations = await getTranslations(locale);
    
    return NextResponse.json(translations);
  } catch (error) {
    console.error(`Error fetching translations:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

