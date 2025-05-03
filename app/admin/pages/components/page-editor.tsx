"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save } from "lucide-react"

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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Define the validation schema for page editing
const pageSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "El título es obligatorio"),
  slug: z.string().min(1, "La URL es obligatoria")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "La URL solo puede contener letras minúsculas, números y guiones"),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  locale: z.string().default("es"),
})

type PageFormValues = z.infer<typeof pageSchema>

interface PageEditorProps {
  pageId: string;
  onCancel: () => void;
}

export default function PageEditor({ pageId, onCancel }: PageEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize form with default values
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      id: pageId,
      title: "",
      slug: "",
      seo: {
        title: "",
        description: "",
        keywords: "",
      },
      locale: "es",
    },
  })

  // Fetch page data when component mounts
  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Use slug parameter to fetch specific page data
        const response = await fetch(`/api/admin/pages?slug=${pageId}`)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const pageData = await response.json()
        
        // Parse keywords array to string for the form
        const keywordsString = pageData.seo?.keywords ? 
          pageData.seo.keywords.join(", ") : 
          ""
        
        // Set form values
        form.reset({
          id: pageData.id,
          title: pageData.title,
          slug: pageData.slug,
          seo: {
            title: pageData.seo?.title || "",
            description: pageData.seo?.description || "",
            keywords: keywordsString,
          },
          locale: "es",
        })
      } catch (err) {
        console.error("Failed to fetch page data:", err)
        setError("No se pudo cargar la información de la página. Por favor, inténtalo de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPageData()
  }, [pageId, form])

  // Handle form submission
  async function onSubmit(data: PageFormValues) {
    setIsSaving(true)
    setSaveSuccess(false)
    setError(null)
    
    try {
      // Convert keywords string to array
      const keywordsArray = data.seo?.keywords ? 
        data.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) : 
        []
      
      // Prepare data for API
      const apiData = {
        ...data,
        seo: {
          ...data.seo,
          keywords: keywordsArray,
        }
      }
      
      // Submit to API
      const response = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al guardar la página")
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
      setError(err instanceof Error ? err.message : "Error al guardar la página. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando página...</p>
      </div>
    )
  }

  if (error && !form.formState.isDirty) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
        <p className="font-medium mb-2">Error</p>
        <p className="text-sm">{error}</p>
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Volver al listado
          </Button>
          <Button 
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="gap-1" 
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al listado</span>
        </Button>
        
        <h2 className="text-lg font-medium">
          Editando página: {form.watch("title") || "Nueva página"}
        </h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Información básica</CardTitle>
                  <CardDescription>
                    Información principal de la página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de la página</FormLabel>
                        <FormControl>
                          <Input placeholder="Título de la página" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de la página</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2 py-1.5">
                              /
                            </Badge>
                            <Input placeholder="url-de-la-pagina" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          La URL debe contener solo letras minúsculas, números y guiones.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* We'll add a rich text editor in the future */}
                  <div className="p-4 bg-muted rounded-md text-center text-sm text-muted-foreground">
                    El editor de contenido enriquecido estará disponible próximamente.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración SEO</CardTitle>
                  <CardDescription>
                    Optimiza el posicionamiento de esta página en los motores de búsqueda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seo.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título SEO</FormLabel>
                        <FormControl>
                          <Input placeholder="Título para SEO" {...field} />
                        </FormControl>
                        <FormDescription>
                          Si se deja vacío, se utilizará el título de la página.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seo.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Breve descripción de la página para motores de búsqueda" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          La descripción ideal tiene entre 120-155 caracteres.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seo.keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Palabras clave</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="palabra1, palabra2, palabra3" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Separadas por comas. Ejemplo: restaurante, comida española, tapas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              Página guardada correctamente
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

