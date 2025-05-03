import { Metadata } from "next"
import { Settings, Clock, MapPin, Phone, Mail, Share2 } from "lucide-react"

import { requireAuth } from "@/lib/auth"
import AdminHeader from "../components/admin-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SettingsForm from "./components/settings-form"

export const metadata: Metadata = {
  title: "Configuración | Admin",
  description: "Administra la configuración general del restaurante",
}

export default function SettingsManagementPage() {
  // Protect this page - redirect to login if not authenticated
  requireAuth()

  return (
    <>
      <AdminHeader 
        title="Configuración" 
        description="Administra los ajustes generales del restaurante" 
      />
      
      <div className="container py-10">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Configuración del restaurante</CardTitle>
            <CardDescription>
              Configura los datos generales, horarios y enlaces a redes sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

