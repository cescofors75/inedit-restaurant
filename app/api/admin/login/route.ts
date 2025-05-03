import { NextRequest, NextResponse } from "next/server"
import { authenticateAdmin, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      )
    }

    // Authenticate admin
    const isValid = await authenticateAdmin(username, password)

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      )
    }

    // Set authentication cookie
    setAuthCookie()

    // Return success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

