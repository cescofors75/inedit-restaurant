"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus, Loader2, Trash2, UploadCloud, Search, ImageOff, AlertTriangle } from "lucide-react"

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

// Define the GalleryImage type based on the Supabase model
type GalleryImage = {
  id: string
  title: Record<string, string>
  description?: Record<string, string>
  image_url: string
  image_width?: number
  image_height?: number
  created_at?: string
  updated_at?: string
  // Localized convenience properties
  localizedTitle: string
  localizedDescription?: string
}

export default function GalleryManager() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // Image upload form state
  const [titleInput, setTitleInput] = useState("")
  const [descriptionInput, setDescriptionInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Function to fetch gallery images
  const fetchGalleryImages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/admin/gallery?locale=es")
      
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
        img.localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (img.localizedDescription && img.localizedDescription.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : images

  // Function to reset the upload form
  const resetUploadForm = () => {
    setTitleInput("")
    setDescriptionInput("")
    setSelectedFile(null)
    setUploadError(null)
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      setUploadError(null)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false)
    resetUploadForm()
  }

  // Handle image upload
  const handleUpload = async () => {
    // Validate input
    if (!titleInput.trim()) {
      setUploadError("El título es obligatorio")
      return
    }

    if (!selectedFile) {
      setUploadError("Debes seleccionar una imagen")
      return
    }

    setIsUploading(true)
    setUploadError(null)
    
    try {
      // Create form data
      const formData = new FormData()
      formData.append("title", titleInput)
      
      if (descriptionInput.trim()) {
        formData.append("description", descriptionInput)
      }
      
      formData.append("file", selectedFile)
      formData.append("locale", "es") // Default locale

      // Send the upload request
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error uploading image")
      }

      // Close dialog and reset form on success
      setDialogOpen(false)
      resetUploadForm()
      
      // Refresh gallery
      fetchGalleryImages()
    } catch (err) {
      console.error("Failed to upload image:", err)
      setUploadError(err instanceof Error ? err.message : "Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle image deletion
  const handleDelete = async (imageId: string) => {
    try {
      // Send delete request with the image ID
      const response = await fetch(`/api/admin/gallery?id=${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error deleting image")
      }

      // Update local state by removing the deleted image
      setImages(images.filter(img => img.id !== imageId))
      
      // Close the dialog
      setSelectedImage(null)
    } catch (err) {
      console.error("Failed to delete image:", err)
      setError("No se pudo eliminar la imagen. Por favor, inténtalo de nuevo.")
    }
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Título <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="title"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="Título de la imagen"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Descripción <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <Input
                      id="description"
                      value={descriptionInput}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      placeholder="Descripción de la imagen"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="file" className="text-sm font-medium">
                      Imagen <span className="text-destructive">*</span>
                    </label>
                    <div className="border rounded-md p-4 text-center">
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-sm font-medium text-primary">{selectedFile.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedFile(null)}
                          >
                            Cambiar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          <div className="text-sm">
                            <label htmlFor="file-upload" className="text-primary hover:underline cursor-pointer">
                              Seleccionar archivo
                            </label>
                            <Input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="sr-only"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            PNG, JPG, GIF hasta 5MB
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {uploadError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={handleDialogClose}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
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
                <DialogHeader>
                  <DialogTitle>Subir primera imagen</DialogTitle>
                  <DialogDescription>
                    Selecciona una imagen para añadir a la galería.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title-first" className="text-sm font-medium">
                        Título <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="title-first"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        placeholder="Título de la imagen"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description-first" className="text-sm font-medium">
                        Descripción <span className="text-muted-foreground">(opcional)</span>
                      </label>
                      <Input
                        id="description-first"
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                        placeholder="Descripción de la imagen"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="file-first" className="text-sm font-medium">
                        Imagen <span className="text-destructive">*</span>
                      </label>
                      <div className="border rounded-md p-4 text-center">
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-sm font-medium text-primary">{selectedFile.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedFile(null)}
                            >
                              Cambiar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm">
                              <label htmlFor="file-upload-first" className="text-primary hover:underline cursor-pointer">
                                Seleccionar archivo
                              </label>
                              <Input
                                id="file-upload-first"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="sr-only"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              PNG, JPG, GIF hasta 5MB
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {uploadError && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={handleDialogClose}
                    disabled={isUploading}
                  >
                    Cancelar
                  </Button>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="group relative border rounded-lg overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.image_url}
                    alt={image.localizedTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{image.localizedTitle}</h3>
                  {image.localizedDescription && (
                    <p className="text-xs text-muted-foreground truncate">
                      {image.localizedDescription}
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

