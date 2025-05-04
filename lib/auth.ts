import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Define types
interface Admin {
  username: string;
  password: string;
}

// Function to read admin.json
function getAdminData(): Admin {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'admin.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading admin data:', error);
    return { username: '', password: '' };
  }
}

// Function to authenticate admin
export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  const admin = getAdminData();
  
  // Check if username and password match
  return admin.username === username && admin.password === password;
}

// Set authentication cookie
export async function setAuthCookie() {
  // In a real app, you'd use a proper token or session handling
  // For simplicity, we're just setting a cookie that expires in 24 hours
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  const cookieStore = cookies();
  await cookieStore.set('admin_authenticated', 'true', {
    expires,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

// Check if admin is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin_authenticated');
  return authCookie?.value === 'true';
}

// Clear authentication cookie (for logout)
export async function clearAuthCookie() {
  const cookieStore = cookies();
  await cookieStore.delete('admin_authenticated');
}

// Middleware to protect admin routes
export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }
}

