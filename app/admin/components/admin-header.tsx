"use client"

import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Home } from "lucide-react"

import LogoutButton from "./logout-button"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminHeaderProps {
  title: string
  description?: string
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Logo + Home Link */}
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <Image 
                src="http://localhost:3000/images/INeDIT_LOGO_Color.png" 
                alt="INÈDIT Restaurant" 
                width={120} 
                height={30} 
                className="h-8 w-auto"
              />
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-1 text-muted-foreground">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Ver sitio</span>
              </Link>
            </Button>
          </div>
          
          {/* Logout Button and Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </div>
      
      {/* Page Title Section */}
      {(title || description) && (
        <div className="container pt-6 pb-2">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
    </header>
  )
}

