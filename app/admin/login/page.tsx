import { Metadata } from "next"
import { LoginForm } from "@/app/admin/login/login-form"

export const metadata: Metadata = {
  title: "Admin Login | INÈDIT Restaurant",
  description: "Login to the INÈDIT Restaurant admin dashboard.",
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-playfair text-3xl font-bold tracking-tight">
            INÈDIT Admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your restaurant content
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}

