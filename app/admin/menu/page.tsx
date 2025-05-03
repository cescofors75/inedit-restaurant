import { Metadata } from "next"
import { UtensilsCrossed } from "lucide-react"

import { requireAuth } from "@/lib/auth"
import AdminHeader from "../components/admin-header"
import MenuCategoriesList from "./components/menu-categories-list"
import MenuItemsList from "./components/menu-items-list"

export const metadata: Metadata = {
  title: "Gestión de Menú | Admin",
  description: "Administra los platos y categorías del menú del restaurante",
}

export default function MenuManagementPage() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Gestión de Menú" 
        description="Administra los platos y categorías del menú del restaurante" 
      />
      
      <div className="container py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Menu Categories Section */}
          <MenuCategoriesList />
          
          {/* Menu Items Section */}
          <MenuItemsList />
        </div>
      </div>
    </>
  )
}

