"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus, Loader2, Trash2, UploadCloud, Search, ImageOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define the GalleryImage type based on the API response
type GalleryImage = {
  id: string
  title: string
  description?: string
  image: {
    url: string
    width: number
    height: number
  }
}

export default function GalleryManager() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Function to fetch gallery images
  const fetchGalleryImages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/admin/gallery")
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setImages(data)
    } catch (err) {
      console.error("Failed to fetch gallery images:", err)
      setError("No se pudieron cargar las imágenes. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Initial fetch on component mount
  useEffect(() => {
    fetchGalleryImages()
  }, [fetchGalleryImages])

  // Filter images based on search query
  const filteredImages = searchQuery
    ? images.filter(img => 
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (img.description && img.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : images

  // Mock upload function (placeholder)
  const handleUpload = () => {
    setIsUploading(true)
    
    // Simulate an upload delay
    setTimeout(() => {
      setIsUploading(false)
      // After upload, refresh the gallery
      fetchGalleryImages()
    }, 1500)
  }

  // Mock delete function (placeholder)
  const handleDelete = (imageId: string) => {
    // Simulate deletion
    console.log(`Deleting image: ${imageId}`)
    
    // Update local state by removing the deleted image
    setImages(images.filter(img => img.id !== imageId))
    
    // Close the dialog
    setSelectedImage(null)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando imágenes...</p>
      </div>
    )
  }

  if (error) {
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
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" />
              <span>Galería de Imágenes</span>
            </CardTitle>
            <CardDescription>
              Gestiona las imágenes de la galería del restaurante
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <UploadCloud className="h-4 w-4" />
                <span>Subir Imagen</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir nueva imagen</DialogTitle>
                <DialogDescription>
                  Selecciona una imagen para añadir a la galería.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="dropzone-file" 
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Haz click para seleccionar</span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG o GIF (MAX. 2MB)
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <Input placeholder="Título de la imagen" className="mb-3" />
                  
                  <label className="block text-sm font-medium mb-1">
                    Descripción (opcional)
                  </label>
                  <Input placeholder="Descripción de la imagen" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancelar</Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="gap-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Subir</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-6 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar imágenes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg"
          />
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <div className="flex justify-center mb-4">
              <ImageOff className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No se encontraron imágenes con ese criterio."
                : "No hay imágenes en la galería."
              }
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <UploadCloud className="h-4 w-4" />
                  <span>Subir primera imagen</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* Same dialog content as above */}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="group relative border rounded-lg overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.image.url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{image.title}</h3>
                  {image.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {image.description}
                    </p>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-7 w-7 rounded-full"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La imagen se eliminará permanentemente de la galería.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground"
                          onClick={() => handleDelete(image.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

