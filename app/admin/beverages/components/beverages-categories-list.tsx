"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Loader2, Wine } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the BeverageCategory type based on the API response
type BeverageCategory = {
  id: string
  name: string | Record<string, string>
  slug: string
  description?: string | Record<string, string>
  parent_id?: string | null
}

// Define type for edit form data
type EditFormData = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: string;
}

export default function BeveragesCategoriesList() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Helper function to get localized value from multilingual object
  const getLocalizedValue = (obj: string | Record<string, string>, locale = 'es'): string => {
    if (typeof obj === 'string') return obj;
    return obj[locale] || obj['en'] || '';
  };

  // Function to fetch beverage categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/beverages?type=categories");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch beverage categories:", err);
      setError("No se pudieron cargar las categorías de bebidas. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Function to handle creating a category
  const handleCreateCategory = () => {
    setEditFormData({});
    setIsCreating(true);
  };

  // Function to handle editing a category
  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setEditFormData({
        id: category.id,
        name: getLocalizedValue(category.name),
        slug: category.slug,
        description: category.description ? getLocalizedValue(category.description) : '',
        parent_id: category.parent_id || undefined,
      });
      setIsEditing(categoryId);
    }
  };

  // Function to handle saving edited category
  const handleSaveEdit = async () => {
    if (isCreating && !editFormData.name) {
      setSaveError("El nombre de la categoría es obligatorio");
      return;
    }

    if (isEditing && !editFormData.id) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Transform data for API
      const apiData = {
        ...(isEditing ? { id: editFormData.id } : {}),
        type: 'category',
        name: editFormData.name,
        slug: editFormData.slug,
        description: editFormData.description,
        parent_id: editFormData.parent_id,
        locale: 'es' // Using Spanish as default locale
      };

      // Call API to update or create category
      const response = await fetch('/api/admin/beverages', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `Failed to ${isEditing ? 'update' : 'create'} category: ${response.statusText}`,
        });
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'}: ${response.status}`);
      }

      // Show success toast
      toast({
        title: isEditing ? "Categoría actualizada" : "Categoría creada",
        description: `La categoría "${apiData.name}" ha sido ${isEditing ? 'actualizada' : 'creada'} correctamente.`,
      });

      // Refresh data
      fetchCategories();
      isEditing ? setIsEditing(null) : setIsCreating(false);
      setEditFormData({});

    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} beverage category:`, error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: `Failed to ${isEditing ? 'update' : 'create'} category: ${error.message}`,
      });
      setSaveError(`Error al ${isEditing ? 'guardar' : 'crear'} los cambios. Inténtalo de nuevo.`);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteCategory = async (categoryId: string) => {
    try {
      // Call API to delete the category
      const response = await fetch(`/api/admin/beverages?id=${categoryId}&type=category`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }
      
      // Show success toast
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada correctamente.",
      });

      // After deletion, refresh the list
      fetchCategories();
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
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
          onClick={() => router.refresh()}
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
              Edita la Categoría de la Bebida
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
            {/* Parent category select */}
            <div className="grid gap-2">
              <Label htmlFor="parent">Categoría Padre (opcional)</Label>
              <Select 
                value={editFormData.parent_id || ''} 
                onValueChange={(value) => setEditFormData({...editFormData, parent_id: value || undefined})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguna (Categoría principal)</SelectItem>
                  {categories
                    .filter(cat => cat.id !== editFormData.id) // Exclude self from parent options
                    .map(category => (
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

      {/* Create Category Dialog */}
      <Dialog open={isCreating} onOpenChange={(open) => !open && setIsCreating(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Categoría</DialogTitle>
            <DialogDescription>
              Añade una nueva categoría para organizar las bebidas
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name input */}
            <div className="grid gap-2">
              <Label htmlFor="create-name">Nombre</Label>
              <Input
                id="create-name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            {/* Slug input */}
            <div className="grid gap-2">
              <Label htmlFor="create-slug">Slug</Label>
              <Input
                id="create-slug"
                value={editFormData.slug || ''}
                onChange={(e) => setEditFormData({...editFormData, slug: e.target.value})}
              />
            </div>
            {/* Description input */}
            <div className="grid gap-2">
              <Label htmlFor="create-description">Descripción</Label>
              <Textarea
                id="create-description"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </div>
            {/* Parent category select */}
            <div className="grid gap-2">
              <Label htmlFor="create-parent">Categoría Padre (opcional)</Label>
              <Select 
                value={editFormData.parent_id || ''} 
                onValueChange={(value) => setEditFormData({...editFormData, parent_id: value || undefined})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguna (Categoría principal)</SelectItem>
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
            <Button className="text-black" variant="outline" onClick={() => setIsCreating(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button className="text-black" onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Crear Categoría'
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
                  <TableHead>Categoría Padre</TableHead>
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
                    <TableCell>
                      {category.parent_id ? (
                        <Badge variant="secondary">
                          {getLocalizedValue(categories.find(c => c.id === category.parent_id)?.name || '')}
                        </Badge>
                      ) : (
                        "—"
                      )}
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
    </>
  )
}