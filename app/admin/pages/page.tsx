import { Metadata } from "next"

import { requireAuth } from "@/lib/auth"
import AdminHeader from "../components/admin-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PageList from "./components/page-list"

export const metadata: Metadata = {
  title: "Gestión de Páginas | Admin",
  description: "Administra las páginas del sitio web",
}

export default function PagesManagementPage() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Gestión de Páginas" 
        description="Administra el contenido y SEO de las páginas del sitio web" 
      />
      
      <div className="container py-10">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Páginas del sitio</CardTitle>
            <CardDescription>
              Aquí podrás gestionar todas las páginas de tu sitio web, incluyendo su contenido, imágenes, 
              metadatos y configuración SEO.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta sección te permite:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>Editar el contenido principal de cada página</li>
              <li>Actualizar las imágenes destacadas</li>
              <li>Gestionar los metadatos para SEO (título, descripción, palabras clave)</li>
              <li>Configurar las URLs y la visibilidad de cada página</li>
            </ul>
            
            <div className="mt-8">
              <PageList />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

