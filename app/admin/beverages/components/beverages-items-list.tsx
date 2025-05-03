"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Filter, Image as ImageIcon, Loader2, Plus, Trash2, Wine } from "lucide-react"

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
type BeverageCategory = {
  id: string
  name: string
  slug: string
  description?: string
}

type BeverageItem = {
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

export default function BeveragesItemsList() {
  const router = useRouter()
  const [items, setItems] = useState<BeverageItem[]>([])
  const [categories, setCategories] = useState<BeverageCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Function to fetch beverages data
  const fetchBeveragesData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch both categories and items
      const response = await fetch("/api/admin/beverages")
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCategories(data.categories)
      setItems(data.items)
    } catch (err) {
      console.error("Failed to fetch beverages data:", err)
      setError("No se pudieron cargar las bebidas. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Initial fetch on component mount
  useEffect(() => {
    fetchBeveragesData()
  }, [fetchBeveragesData])

  // Get filtered items based on selected category
  const filteredItems = selectedCategoryId === "all" 
    ? items
    : items.filter(item => item.category?.sys?.id === selectedCategoryId)

  // Find category name from id
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : "Sin categoría"
  }

  // Functions for handling item actions
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
      console.log(`Deleting beverage: ${itemId}`);
      
      // After deletion, refresh the list
      fetchBeveragesData();
    } catch (error) {
      console.error("Failed to delete beverage:", error);
    } finally {
      setIsDeleting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando bebidas...</p>
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-primary" />
              <span>Bebidas</span>
            </CardTitle>
            <CardDescription>
              Gestiona las bebidas del restaurante
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
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateItem} className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Nueva Bebida</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground mb-4">
              {selectedCategoryId === "all" 
                ? "No hay bebidas creadas aún."
                : "No hay bebidas en esta categoría."}
            </p>
            <Button className="gap-1" onClick={handleCreateItem}>
              <Plus className="h-4 w-4" />
              <span>Crear nueva bebida</span>
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
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-muted-foreground text-sm line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getCategoryName(item.category?.sys?.id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.price} €
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.image ? (
                      <Badge variant="outline" className="bg-primary/10 gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span>Sí</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span>No</span>
                      </Badge>
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
                            <AlertDialogTitle>¿Eliminar bebida?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar esta bebida?
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
