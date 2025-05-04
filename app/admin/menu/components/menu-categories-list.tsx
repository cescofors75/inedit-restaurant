"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Plus, Trash2, UtensilsCrossed } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

// Define the MenuCategory type based on the API response
type MenuCategory = {
  id: string
  name: string | Record<string, string>
  slug: string
  description?: string | Record<string, string>
}

// Define type for edit form data
type EditFormData = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
}

export default function MenuCategoriesList() {
  const router = useRouter()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<EditFormData>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  // Helper function to get localized value from multilingual object
  const getLocalizedValue = (obj: string | Record<string, string>, locale = 'es'): string => {
    if (typeof obj === 'string') return obj;
    return obj[locale] || obj['en'] || '';
  };

  // Function to fetch menu categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/admin/menu?type=categories")
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Failed to fetch menu categories:", err)
      setError("No se pudieron cargar las categorías del menú. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Load categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreateCategory = () => {
    // Implementation for creating a new category
    setIsCreating(true);
  }

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setEditFormData({
        id: category.id,
        name: getLocalizedValue(category.name),
        slug: category.slug,
        description: category.description ? getLocalizedValue(category.description) : '',
      });
      setIsEditing(categoryId);
    }
  }

  const handleSaveEdit = async () => {
    if (!editFormData.id) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Transform data for API
      const apiData = {
        id: editFormData.id,
        type: 'category',
        name: editFormData.name,
        slug: editFormData.slug,
        description: editFormData.description,
        locale: 'es' // Using Spanish as default locale
      };
      
      // Call API to update item
      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update: ${response.status}`);
      }
      
      // Refresh data
      fetchCategories();
      setIsEditing(null);
      setEditFormData({});
      
    } catch (error) {
      console.error('Error updating menu item:', error);
      setSaveError('Error al guardar los cambios. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteCategory = async (categoryId: string) => {
    try {
      // This would make an actual DELETE request to the API
      console.log(`Deleting category: ${categoryId}`);
      
      // After deletion, refresh the list
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando categorías del menú...</p>
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
    <>
      {/* Edit Category Dialog */}
      <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Edita la categoría del menú
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name input */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            {/* Slug input */}
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={editFormData.slug || ''}
                onChange={(e) => setEditFormData({...editFormData, slug: e.target.value})}
              />
            </div>
            {/* Description input */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </div>

            {saveError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {saveError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button className="text-black" variant="outline" onClick={() => setIsEditing(null)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button className="text-black" onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                <span>Categorías del Menú</span>
              </CardTitle>
              <CardDescription>
                Gestiona las categorías para organizar los platos del menú
              </CardDescription>
            </div>
            <Button onClick={handleCreateCategory} className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Nueva Categoría</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground mb-4">No hay categorías de menú creadas aún.</p>
              <Button className="gap-1" onClick={handleCreateCategory}>
                <Plus className="h-4 w-4" />
                <span>Crear nueva categoría</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{getLocalizedValue(category.name)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {category.slug}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {category.description ? getLocalizedValue(category.description) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 h-8"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 h-8"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              <span>Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Si hay platos asignados a esta categoría, también serán eliminados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => confirmDeleteCategory(category.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}