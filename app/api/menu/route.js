// src/app/api/menu/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ruta al archivo menu.json
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'menu.json');

// Función para leer el archivo de menú
async function readMenuFile() {
  if (!fs.existsSync(dataFilePath)) {
    throw new Error('El archivo menu.json no existe');
  }
  
  const jsonData = await fs.promises.readFile(dataFilePath, 'utf8');
  return JSON.parse(jsonData);
}

// Función para escribir en el archivo de menú
async function writeMenuFile(data) {
  await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Obtener el menú completo
export async function GET() {
  try {
    const menuData = await readMenuFile();
    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error al leer el menú:', error);
    return NextResponse.json(
      { error: 'Error al leer el archivo de menú', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Actualizar el menú completo
export async function PUT(request) {
  try {
    const updatedMenu = await request.json();
    
    // Validación básica
    if (!updatedMenu || !updatedMenu.categories || !updatedMenu.items || 
        !Array.isArray(updatedMenu.categories) || !Array.isArray(updatedMenu.items)) {
      return NextResponse.json(
        { error: 'Estructura de menú inválida. Se requieren arrays de categories e items' },
        { status: 400 }
      );
    }
    
    // Verificar que todos los items tengan categorías válidas
    const categoryIds = updatedMenu.categories.map(cat => cat.id);
    const invalidItems = updatedMenu.items.filter(item => !categoryIds.includes(item.categoryId));
    
    if (invalidItems.length > 0) {
      return NextResponse.json(
        { 
          error: 'Hay platos con categorías inválidas', 
          invalidItems: invalidItems.map(item => item.id) 
        },
        { status: 400 }
      );
    }
    
    // Guardar los cambios
    await writeMenuFile(updatedMenu);
    
    return NextResponse.json({ success: true, message: 'Menú actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el menú:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el archivo de menú', details: error.message },
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