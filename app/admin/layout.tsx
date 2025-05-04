import { Metadata } from "next"
import { cookies } from "next/headers"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Admin Dashboard | INÈDIT Restaurant",
  description: "Management dashboard for INÈDIT Restaurant content.",
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Get theme setting from cookie
  const cookieStore = await cookies()
  const theme = cookieStore.get("theme")

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </ThemeProvider>
  )
}

