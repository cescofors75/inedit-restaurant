import { Metadata } from "next"
import { Images } from "lucide-react"

import { requireAuth } from "@/lib/auth"
import AdminHeader from "../components/admin-header"
import GalleryManager from "./components/gallery-manager"

export const metadata: Metadata = {
  title: "Gestión de Galería | Admin",
  description: "Administra las imágenes de la galería del restaurante",
}

export default function GalleryManagementPage() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Gestión de Galería" 
        description="Administra las imágenes de la galería del restaurante" 
      />
      
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <GalleryManager />
        </div>
      </div>
    </>
  )
}

