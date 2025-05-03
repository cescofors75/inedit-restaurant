import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST() {
  // Clear the authentication cookie
  clearAuthCookie()
  
  // Return success response
  return NextResponse.json({ success: true })
}

