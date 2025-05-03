"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Header />}
      <main>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  )
}

