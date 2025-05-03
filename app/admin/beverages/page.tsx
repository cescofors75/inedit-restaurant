import { Metadata } from "next"
import { Wine } from "lucide-react"  // Changed icon to Wine for beverages

import { requireAuth } from "@/lib/auth"
import AdminHeader from "../components/admin-header"
import BeveragesCategoriesList from "./components/beverages-categories-list"
import BeveragesItemsList from "./components/beverages-items-list"

export const metadata: Metadata = {
  title: "Gestión de Bebidas | Admin",
  description: "Administra las bebidas y categorías de bebidas del restaurante",
}

export default function BeveragesManagementPage() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Gestión de Bebidas" 
        description="Administra las bebidas y categorías de bebidas del restaurante" 
      />
      
      <div className="container py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Beverages Categories Section */}
          <BeveragesCategoriesList />
          
          {/* Beverages Items Section */}
          <BeveragesItemsList />
        </div>
      </div>
    </>
  )
}

