"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Plus, Trash2, Wine } from "lucide-react"

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

// Define the BeverageCategory type based on the API response
type BeverageCategory = {
  id: string
  name: string
  slug: string
  description?: string
}

export default function BeveragesCategoriesList() {
  const router = useRouter()
  const [categories, setCategories] = useState<BeverageCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Function to fetch beverage categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/admin/beverages?type=categories")
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Failed to fetch beverage categories:", err)
      setError("No se pudieron cargar las categorías de bebidas. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Initial fetch on component mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Functions for handling category actions
  const handleCreateCategory = () => {
    setIsCreating(true);
    // In a real implementation, this would open a form dialog
  }

  const handleEditCategory = (categoryId: string) => {
    setIsEditing(categoryId);
    // In a real implementation, this would open a form dialog with category data
  }

  const confirmDeleteCategory = async (categoryId: string) => {
    try {
      // This would make an actual DELETE request to the API
      console.log(`Deleting beverage category: ${categoryId}`);
      
      // After deletion, refresh the list
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando categorías de bebidas...</p>
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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-primary" />
              <span>Categorías de Bebidas</span>
            </CardTitle>
            <CardDescription>
              Gestiona las categorías para organizar las bebidas del restaurante
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
            <p className="text-muted-foreground mb-4">No hay categorías de bebidas creadas aún.</p>
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
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {category.description || "—"}
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
                              Esta acción no se puede deshacer. Si hay bebidas asignadas a esta categoría, también serán eliminadas.
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
  )
}

