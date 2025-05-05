// src/app/api/beverages/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ruta al archivo beverages.json en la carpeta public
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'beverages.json');

// Función para leer el archivo de bebidas
async function readDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    return null; // El archivo no existe
  }
  
  const jsonData = await fs.promises.readFile(dataFilePath, 'utf8');
  return JSON.parse(jsonData);
}

// Función para escribir en el archivo
async function writeDataFile(data) {
  // Asegurarse de que el directorio existe
  const dirPath = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dirPath)) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Obtener el contenido del archivo
export async function GET() {
  try {
    const data = await readDataFile();
    
    if (!data) {
      return NextResponse.json(
        { error: 'El archivo beverages.json no existe' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al leer el archivo beverages.json:', error);
    return NextResponse.json(
      { error: 'Error al leer el archivo', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Actualizar el contenido del archivo
export async function PUT(request) {
  try {
    const updatedData = await request.json();
    
    // Validación básica
    if (!updatedData || !updatedData.categories || !updatedData.items || 
        !Array.isArray(updatedData.categories) || !Array.isArray(updatedData.items)) {
      return NextResponse.json(
        { error: 'Estructura inválida. Se requieren arrays de categories e items' },
        { status: 400 }
      );
    }
    
    // Verificar que todos los items tengan categorías válidas
    if (updatedData.items.length > 0 && updatedData.categories.length > 0) {
      const categoryIds = updatedData.categories.map(cat => cat.id);
      const invalidItems = updatedData.items.filter(item => !categoryIds.includes(item.categoryId));
      
      if (invalidItems.length > 0) {
        return NextResponse.json(
          { 
            error: 'Hay bebidas con categorías inválidas', 
            invalidItems: invalidItems.map(item => item.id) 
          },
          { status: 400 }
        );
      }
    }
    
    // Guardar los cambios
    await writeDataFile(updatedData);
    
    return NextResponse.json({ success: true, message: 'Archivo beverages.json actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el archivo beverages.json:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el archivo', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Para crear el archivo inicial si no existe
export async function POST(request) {
  try {
    // Verificar si el archivo ya existe
    if (fs.existsSync(dataFilePath)) {
      return NextResponse.json(
        { error: 'El archivo beverages.json ya existe' },
        { status: 400 }
      );
    }
    
    const initialData = await request.json();
    
    // Validación básica
    if (!initialData || !initialData.categories || !initialData.items || 
        !Array.isArray(initialData.categories) || !Array.isArray(initialData.items)) {
      return NextResponse.json(
        { error: 'Estructura inválida. Se requieren arrays de categories e items' },
        { status: 400 }
      );
    }
    
    // Crear el archivo
    await writeDataFile(initialData);
    
    return NextResponse.json(
      { success: true, message: 'Archivo beverages.json creado correctamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear el archivo beverages.json:', error);
    return NextResponse.json(
      { error: 'Error al crear el archivo', details: error.message },
      { status: 500 }
    );
  }
}

// OPTIONS: Para manejar CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}