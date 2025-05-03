"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Plus, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageEditor from "./page-editor"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Define the Page type based on the API response
type Page = {
  id: string
  title: string
  slug: string
  updatedAt: string
}

export default function PageList() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)

  // Function to fetch pages data
  const fetchPages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/admin/pages")
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setPages(data)
    } catch (err) {
      console.error("Failed to fetch pages:", err)
      setError("No se pudieron cargar las páginas. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Initial fetch on component mount
  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  // Function to handle page edit
  const handleEditPage = (pageId: string) => {
    setEditingPageId(pageId)
  }

  // Function to handle cancel edit and return to list
  const handleCancelEdit = () => {
    setEditingPageId(null)
    fetchPages() // Refresh the list after editing
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // If we're editing a page, show the editor
  if (editingPageId) {
    return <PageEditor pageId={editingPageId} onCancel={handleCancelEdit} />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando páginas...</p>
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

  if (pages.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-muted-foreground mb-4">No hay páginas creadas aún.</p>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Crear nueva página</span>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Listado de páginas</h2>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Crear nueva página</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Última actualización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium">{page.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  /{page.slug}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(page.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 h-8"
                    asChild
                  >
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Ver</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 h-8"
                    onClick={() => handleEditPage(page.id)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Editar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

