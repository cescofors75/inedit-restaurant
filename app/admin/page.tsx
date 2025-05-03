import Link from "next/link"
import { Metadata } from "next"
import { LayoutGrid, UtensilsCrossed, Images, Settings, Languages, Wine } from "lucide-react"

import { requireAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AdminHeader from "./components/admin-header"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your restaurant's content",
}

export default function AdminDashboard() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Dashboard" 
        description="Gestiona el contenido de tu restaurante" 
      />
      
      <div className="container py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pages Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                <span>Páginas</span>
              </CardTitle>
              <CardDescription>
                Gestiona las páginas y contenido del sitio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Edita el contenido de las páginas, SEO y metadatos del sitio.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/pages">
                  Gestionar páginas
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Menu Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                <span>Menú</span>
              </CardTitle>
              <CardDescription>
                Gestiona los platos y categorías
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Añade, edita o elimina platos y categorías del menú del restaurante.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/menu">
                  Gestionar menú
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Beverages Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wine className="h-5 w-5 text-primary" />
                <span>Bebidas</span>
              </CardTitle>
              <CardDescription>
                Gestiona las bebidas y categorías
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Añade, edita o elimina bebidas y categorías de bebidas del restaurante.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/beverages">
                  Gestionar bebidas
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Gallery Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                <span>Galería</span>
              </CardTitle>
              <CardDescription>
                Gestiona las imágenes de la galería
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Añade, edita o elimina imágenes de la galería del restaurante.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/gallery">
                  Gestionar galería
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Settings Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Configuración</span>
              </CardTitle>
              <CardDescription>
                Ajustes generales del restaurante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Edita la información de contacto, horarios y redes sociales.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/settings">
                  Editar configuración
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Translations Management */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <span>Traducciones</span>
              </CardTitle>
              <CardDescription>
                Gestiona las traducciones multilingües
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Edita los textos en diferentes idiomas para el sitio web.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/translations">
                  Gestionar traducciones
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
