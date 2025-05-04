"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Filter, Image as ImageIcon, Loader2, Plus, Trash2, UtensilsCrossed } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Define types based on the API response
type MenuCategory = {
  id: string
  name: string | Record<string, string>
  slug: string
  description?: string | Record<string, string>
}

type MenuItem = {
  id: string
  name: string | Record<string, string>
  description?: string | Record<string, string>
  price: string
  category_id?: string
  image_url?: string
  image_width?: number
  image_height?: number
}

// Define the type for edit form data
type EditFormData = {
  id?: string;
  name?: string;
  description?: string;
  price?: string;
  category_id?: string;
}

// Function for deleting menu items (add implementation or import)
const deleteMenuItemFromSupabase = async (itemId: string): Promise<boolean> => {
  // Replace with actual implementation
  console.log(`Would delete menu item with ID: ${itemId}`);
  return true;
}

export default function MenuItemsList() {
  const router = useRouter()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<EditFormData>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  // Helper function to get localized value from multilingual object
  const getLocalizedValue = (obj: string | Record<string, string>, locale = 'es'): string => {
    if (typeof obj === 'string') return obj;
    return obj[locale] || obj['en'] || '';
  };

  // Function to fetch menu data
  const fetchMenuData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch both categories and items
      const response = await fetch("/api/admin/menu")
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCategories(data.categories)
      setItems(data.items)
    } catch (err) {
      console.error("Failed to fetch menu data:", err)
      setError("No se pudieron cargar los platos del menú. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Initial fetch on component mount
  useEffect(() => {
    fetchMenuData()
  }, [fetchMenuData])

  // Get filtered items based on selected category
  const filteredItems = selectedCategoryId === "all" 
    ? items
    : items.filter(item => item.category_id === selectedCategoryId)

  // Find category name from id
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? getLocalizedValue(category.name) : "Sin categoría"
  }

  const handleEditItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setEditFormData({
        id: item.id,
        name: getLocalizedValue(item.name),
        description: item.description ? getLocalizedValue(item.description) : '',
        price: item.price,
        category_id: item.category_id,
      });
      setIsEditing(itemId);
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
        type: 'item',
        name: editFormData.name,
        description: editFormData.description,
        price: editFormData.price,
        categoryId: editFormData.category_id,
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
      fetchMenuData();
      setIsEditing(null);
      setEditFormData({});
      
    } catch (error) {
      console.error('Error updating menu item:', error);
      setSaveError('Error al guardar los cambios. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Functions for handling item actions
  const handleCreateItem = () => {
    setIsCreating(true);
    // In a real implementation, this would open a form dialog
  }

  const confirmDeleteItem = async (itemId: string) => {
    try {
      // Call the delete function
      const success = await deleteMenuItemFromSupabase(itemId);
      
      if(!success) {
        throw new Error(`Failed to delete menu item with id: ${itemId}`);
      }
      // After deletion, refresh the list
      fetchMenuData();
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    } finally {
      setIsDeleting(null);
      fetchMenuData();
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando platos del menú...</p>
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
      {/* Edit Item Dialog */}
      <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Plato</DialogTitle>
            <DialogDescription>
              Actualiza la información del plato. Haz clic en guardar cuando hayas terminado.
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
            {/* Description input */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description" 
                value={editFormData.description || ''} 
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </div>
            {/* Price input */}
            <div className="grid gap-2">
              <Label htmlFor="price">Precio (€)</Label>
              <Input 
                id="price" 
                value={editFormData.price || ''} 
                onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
              />
            </div>
            {/* Category select */}
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={editFormData.category_id || ''} 
                onValueChange={(value) => setEditFormData({...editFormData, category_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {getLocalizedValue(category.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {saveError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {saveError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-black" onClick={() => setIsEditing(null)} disabled={isSaving}>
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <span>Platos del Menú</span>
            </CardTitle>
            <CardDescription>
              Gestiona los platos del restaurante
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedCategoryId} 
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {getLocalizedValue(category.name)}
                </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateItem} className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Nuevo Plato</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground mb-4">
              {selectedCategoryId === "all" 
                ? "No hay platos creados aún."
                : "No hay platos en esta categoría."}
            </p>
            <Button className="gap-1" onClick={handleCreateItem}>
              <Plus className="h-4 w-4" />
              <span>Crear nuevo plato</span>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{getLocalizedValue(item.name)}</div>
                      {item.description && (
                        <div className="text-muted-foreground text-sm line-clamp-1">
                          {getLocalizedValue(item.description)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {item.category_id ? getCategoryName(item.category_id) : "Sin categoría"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.price} €
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.image_url ? (
                      <Badge variant="outline" className="bg-primary/10 gap-1">
                        <ImageIcon className="h-3 w-3" />
                      </Badge>
                    ) : (
                     ""
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 h-8"
                        onClick={() => handleEditItem(item.id)}
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
                            <AlertDialogTitle>¿Eliminar plato?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar este plato?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => confirmDeleteItem(item.id)}
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