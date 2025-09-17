"use client"

import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-dvh flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default AppShell
