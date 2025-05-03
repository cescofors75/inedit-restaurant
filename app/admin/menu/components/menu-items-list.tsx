"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Filter, Image as ImageIcon, Loader2, Plus, Trash2, UtensilsCrossed } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  name: string
  slug: string
  description?: string
}

type MenuItem = {
  id: string
  name: string
  description: string
  price: string
  category: {
    sys: {
      id: string
    }
  }
  image?: any
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
      setError("No se pudieron cargar los platos. Por favor, inténtalo de nuevo.")
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
    : items.filter(item => item.category?.sys?.id === selectedCategoryId)

  // Find category name from id
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : "Sin categoría"
  }

  // Functions for handling item actions (to be implemented fully later)
  const handleCreateItem = () => {
    setIsCreating(true);
    // In a real implementation, this would open a form dialog
  }

  const handleEditItem = (itemId: string) => {
    setIsEditing(itemId);
    // In a real implementation, this would open a form dialog with item data
  }

  const confirmDeleteItem = async (itemId: string) => {
    try {
      // This would make an actual DELETE request to the API
      console.log(`Deleting item: ${itemId}`);
      
      // After deletion, refresh the list
      fetchMenuData();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsDeleting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando platos...</p>
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
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <span>Platos del Menú</span>
            </CardTitle>
            <CardDescription>
              Gestiona los platos disponibles en el restaurante
            </CardDescription>
          </div>
          <Button onClick={handleCreateItem} className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Nuevo Plato</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mr-2">Filtrar por categoría:</p>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground mb-4">
              {selectedCategoryId 
                ? "No hay platos en esta categoría." 
                : "No hay platos creados aún."
              }
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
                <TableHead>Precio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {item.description || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {item.price}€
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.category?.sys?.id ? (
                      <Badge variant="outline">
                        {getCategoryName(item.category.sys.id)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin categoría</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.image ? (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
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
                              Esta acción no se puede deshacer. El plato será eliminado permanentemente.
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
  )
}

