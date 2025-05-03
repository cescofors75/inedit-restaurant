"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, Languages, Loader2, Plus, Save, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Support languages
const LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "ca", name: "Català" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" }
]

export default function TranslationsManager() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState("es")
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [editedTranslations, setEditedTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingKey, setIsAddingKey] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Function to fetch translations for the current locale
  const fetchTranslations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/translations?locale=${currentLocale}`)
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setTranslations(data)
      setEditedTranslations(data) // Initialize edited translations
    } catch (err) {
      console.error("Failed to fetch translations:", err)
      setError("No se pudieron cargar las traducciones. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }, [currentLocale, router])

  // Fetch translations when locale changes
  useEffect(() => {
    fetchTranslations()
  }, [currentLocale, fetchTranslations])

  // Handle translation updates
  const handleTranslationChange = (key: string, value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle saving translations
  const handleSaveTranslations = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      // In a real implementation, this would send updates to the API
      console.log("Saving translations:", editedTranslations)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, just update the local state
      setTranslations(editedTranslations)
      setSaveSuccess(true)
      
      // Clear success message after a delay
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Failed to save translations:", err)
      setError("No se pudieron guardar las traducciones. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle adding a new translation key
  const handleAddTranslationKey = () => {
    if (!newKey.trim() || !newValue.trim()) {
      return
    }
    
    // Add the new key to both translations and editedTranslations
    setTranslations(prev => ({
      ...prev,
      [newKey.trim()]: newValue.trim(),
    }))
    
    setEditedTranslations(prev => ({
      ...prev,
      [newKey.trim()]: newValue.trim(),
    }))
    
    // Reset form fields
    setNewKey("")
    setNewValue("")
    setIsAddingKey(false)
  }

  // Handle deleting a translation key
  const handleDeleteTranslationKey = (key: string) => {
    // Remove the key from both translations and editedTranslations
    const { [key]: _, ...restTranslations } = translations
    const { [key]: __, ...restEditedTranslations } = editedTranslations
    
    setTranslations(restTranslations)
    setEditedTranslations(restEditedTranslations)
  }

  // Filter translations based on search query
  const filteredTranslations = searchQuery
    ? Object.entries(translations).filter(([key, value]) => 
        key.toLowerCase().includes(searchQuery.toLowerCase()) || 
        value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : Object.entries(translations)

  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(translations) !== JSON.stringify(editedTranslations)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Cargando traducciones...</p>
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
              <Languages className="h-5 w-5 text-primary" />
              <span>Traducciones</span>
            </CardTitle>
            <CardDescription>
              Gestiona los textos en diferentes idiomas para el sitio web
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={currentLocale}
              onValueChange={setCurrentLocale}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Selecciona idioma" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-1" onClick={() => setIsAddingKey(true)}>
                  <Plus className="h-4 w-4" />
                  <span>Nueva clave</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir nueva clave de traducción</DialogTitle>
                  <DialogDescription>
                    Crea una nueva clave con su traducción para el idioma actual ({LANGUAGES.find(l => l.code === currentLocale)?.name}).
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Clave de traducción
                    </label>
                    <Input 
                      placeholder="ejemplo.clave.texto" 
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Usa formato tipo "seccion.subseccion.elemento"
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Texto traducido
                    </label>
                    <Textarea 
                      placeholder="Texto traducido para esta clave"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingKey(false)}>Cancelar</Button>
                  <Button onClick={handleAddTranslationKey} disabled={!newKey.trim() || !newValue.trim()}>
                    Añadir clave
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              className="gap-1" 
              disabled={!hasUnsavedChanges || isSaving}
              onClick={handleSaveTranslations}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Save success message */}
        {saveSuccess && (
          <div className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-800">
            Traducciones guardadas correctamente
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-6 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar claves o traducciones..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg"
          />
        </div>

        {filteredTranslations.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No se encontraron traducciones con ese criterio."
                : "No hay traducciones para este idioma."
              }
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Añadir primera traducción</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* Same dialog content as above */}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Clave</TableHead>
                  <TableHead>Traducción ({LANGUAGES.find(l => l.code === currentLocale)?.name})</TableHead>
                  <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranslations.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-mono text-sm">{key}</TableCell>
                    <TableCell>
                      <Textarea 
                        value={editedTranslations[key] || value}
                        onChange={(e) => handleTranslationChange(key, e.target.value)}
                        className="min-h-[60px] w-full"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar clave de traducción?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará la clave "{key}" para todos los idiomas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleDeleteTranslationKey(key)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

