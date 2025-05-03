"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, Loader2, Mail, MapPin, Phone, Save, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// Define the validation schema for settings form
const openingHourSchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().default(false),
})

const contactInfoSchema = z.object({
  address: z.string().min(1, "La dirección es obligatoria"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
})

const settingsSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre del restaurante es obligatorio"),
  description: z.string().optional(),
  contactInfo: contactInfoSchema,
  openingHours: z.object({
    monday: openingHourSchema,
    tuesday: openingHourSchema,
    wednesday: openingHourSchema,
    thursday: openingHourSchema,
    friday: openingHourSchema,
    saturday: openingHourSchema,
    sunday: openingHourSchema,
  }),
  socialMedia: z.record(z.string().url("URL inválida")),
  locale: z.string().default("es"),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

// Helper function to translate day names
const getDayName = (day: string): string => {
  const days: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo"
  }
  return days[day] || day
}

// Helper function to translate social media platform names
const getPlatformName = (platform: string): string => {
  const platforms: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
  }
  return platforms[platform] || platform
}

export default function SettingsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      contactInfo: {
        address: "",
        phone: "",
        email: "",
      },
      openingHours: {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "10:00", close: "16:00", closed: false },
        sunday: { open: "", close: "", closed: true },
      },
      socialMedia: {
        instagram: "",
        facebook: "",
        twitter: "",
      },
      locale: "es",
    },
  })

  // Fetch settings data when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch("/api/admin/settings")
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const settings = await response.json()
        
        // Convert the opening hours array to the format expected by the form
        const openingHoursObj: Record<string, { open: string, close: string, closed: boolean }> = {
          monday: { open: "", close: "", closed: true },
          tuesday: { open: "", close: "", closed: true },
          wednesday: { open: "", close: "", closed: true },
          thursday: { open: "", close: "", closed: true },
          friday: { open: "", close: "", closed: true },
          saturday: { open: "", close: "", closed: true },
          sunday: { open: "", close: "", closed: true },
        }
        
        settings.openingHours.forEach((hour: { day: string; open: string; close: string; closed: boolean }) => {
          openingHoursObj[hour.day] = {
            open: hour.open,
            close: hour.close,
            closed: hour.closed,
          }
        })
        
        // Convert social media array to object
        const socialMediaObj: Record<string, string> = {}
        settings.socialMedia.forEach((item: { platform: string; url: string }) => {
          socialMediaObj[item.platform] = item.url
        })
        
        // Reset form with data
        form.reset({
          id: settings.id,
          name: settings.name,
          description: settings.description || "",
          contactInfo: settings.contactInfo,
          openingHours: openingHoursObj,
          socialMedia: socialMediaObj,
          locale: "es",
        })
      } catch (err) {
        console.error("Failed to fetch settings:", err)
        setError("No se pudo cargar la configuración. Por favor, inténtalo de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSettings()
  }, [form])

  // Handle form submission
  async function onSubmit(data: SettingsFormValues) {
    setIsSaving(true)
    setSaveSuccess(false)
    setError(null)
    
    try {
      // Submit to API
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al guardar la configuración")
      }
      
      // Update was successful
      setSaveSuccess(true)
      
      // Refresh router data
      router.refresh()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la configuración. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  const watchOpeningHours = form.watch("openingHours")

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando configuración...</p>
      </div>
    )
  }

  if (error && !form.formState.isDirty) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
        <p className="font-medium mb-2">Error</p>
        <p className="text-sm">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
              <TabsTrigger value="hours">Horarios</TabsTrigger>
              <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>
                    Configuración general del restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del restaurante</FormLabel>
                        <FormControl>
                          <Input placeholder="INÈDIT Restaurant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Breve descripción del restaurante" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Esta descripción se utilizará en varias partes del sitio.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Contact Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Información de Contacto</span>
                  </CardTitle>
                  <CardDescription>
                    Datos de contacto y ubicación del restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactInfo.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Calle, número, código postal, ciudad" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="+34 XXX XX XX XX" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="info@example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Hours Tab */}
            <TabsContent value="hours">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Horarios de Apertura</span>
                  </CardTitle>
                  <CardDescription>
                    Define los horarios de apertura para cada día de la semana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const).map((day) => (
                      <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="font-medium">{getDayName(day)}</div>
                        
                        <FormField
                          control={form.control}
                          name={`openingHours.${day}.closed`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-end space-x-2">
                              <FormLabel>Cerrado</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={`openingHours.${day}.open`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Apertura</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time" 
                                    placeholder="09:00" 
                                    {...field} 
                                    disabled={watchOpeningHours[day].closed}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`openingHours.${day}.close`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cierre</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time" 
                                    placeholder="18:00" 
                                    {...field} 
                                    disabled={watchOpeningHours[day].closed}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator className="col-span-4 md:col-span-4 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Social Media Tab */}
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <span>Redes Sociales</span>
                  </CardTitle>
                  <CardDescription>
                    Enlaces a las redes sociales del restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["instagram", "facebook", "twitter", "linkedin", "youtube", "tiktok"].map((platform) => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name={`socialMedia.${platform}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{getPlatformName(platform)}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`https://${platform}.com/...`} 
                                type="url"
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              URL completa incluyendo https://
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="mt-4 rounded-md bg-destructive/15 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}
          
          {saveSuccess && (
            <div className="mt-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-800">
              Configuración guardada correctamente
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              className="gap-1" 
              disabled={isSaving || !form.formState.isDirty}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar cambios</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
