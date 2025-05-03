import { Metadata } from "next"
import { Languages } from "lucide-react"

import { requireAuth } from "@/lib/auth"
import AdminHeader from "../components/admin-header"
import TranslationsManager from "./components/translations-manager"

export const metadata: Metadata = {
  title: "Gestión de Traducciones | Admin",
  description: "Administra las traducciones multilingües del sitio web",
}

export default function TranslationsManagementPage() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Gestión de Traducciones" 
        description="Administra las traducciones multilingües del sitio web" 
      />
      
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <TranslationsManager />
        </div>
      </div>
    </>
  )
}
