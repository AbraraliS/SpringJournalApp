"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  const linkClass = (href: string) =>
    cn(
      "px-3 py-2 rounded-md text-sm font-medium",
      pathname === href ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground hover:bg-muted",
    )

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            JournalApp
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/journal" className={linkClass("/journal")}>
              Journal
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <Button size="sm" variant="destructive" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
