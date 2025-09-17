"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { api } from "@/services/api"

type AuthContextType = {
  token: string | null
  username: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (payload: { username: string; password: string }) => Promise<void>
  register: (payload: { username: string; password: string }) => Promise<void>
  updateUser: (payload: { username?: string; password?: string }) => Promise<void>
  deleteUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const savedUsername = typeof window !== "undefined" ? localStorage.getItem("username") : null
    if (savedToken) setToken(savedToken)
    if (savedUsername) setUsername(savedUsername)
    setLoading(false)

    const onForcedLogout = () => {
      doLogout(true)
    }
    window.addEventListener("auth:logout", onForcedLogout as EventListener)
    return () => window.removeEventListener("auth:logout", onForcedLogout as EventListener)
  }, [])

  const doLogout = (silent = false) => {
    setToken(null)
    setUsername(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
    }
    if (!silent) toast({ title: "Logged out" })
    router.push("/login")
  }

  const login: AuthContextType["login"] = async ({ username, password }) => {
    try {
      const res = await api.post("/auth/login", { username, password })
      const headerAuth = res.headers?.authorization as string | undefined
      const headerToken = headerAuth?.toLowerCase().startsWith("bearer ")
        ? headerAuth.slice(7).trim()
        : headerAuth?.trim()

      const possibleToken =
        (res.data?.token as string | undefined) ||
        (res.data?.access_token as string | undefined) ||
        (res.data?.accessToken as string | undefined) ||
        (res.data?.jwt as string | undefined) ||
        (res.data?.data?.token as string | undefined) ||
        (res.data?.data?.access_token as string | undefined) ||
        (res.data?.data?.accessToken as string | undefined) ||
        headerToken ||
        null

      const t = possibleToken
      const u = res.data?.username ?? username

      if (!t) {
        toast({
          title: "Login failed",
          description: "Missing token in server response. Please try again.",
          variant: "destructive",
        })
        return
      }

      setToken(t)
      setUsername(u)
      localStorage.setItem("token", t)
      localStorage.setItem("username", u)
      toast({ title: "Welcome back!", description: `Logged in as ${u}` })
      router.push("/journal")
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.response?.data?.message || "Please check your credentials.",
        variant: "destructive",
      })
      return
    }
  }

  const register: AuthContextType["register"] = async ({ username, password }) => {
    try {
      const res = await api.post("/user", { username, password })
      const headerAuth = res.headers?.authorization as string | undefined
      const headerToken = headerAuth?.toLowerCase().startsWith("bearer ")
        ? headerAuth.slice(7).trim()
        : headerAuth?.trim()

      const possibleToken =
        (res.data?.token as string | undefined) ||
        (res.data?.access_token as string | undefined) ||
        (res.data?.accessToken as string | undefined) ||
        (res.data?.jwt as string | undefined) ||
        (res.data?.data?.token as string | undefined) ||
        (res.data?.data?.access_token as string | undefined) ||
        (res.data?.data?.accessToken as string | undefined) ||
        headerToken ||
        null

      const t = possibleToken
      const u = res.data?.username ?? username

      if (t) {
        setToken(t)
        setUsername(u)
        localStorage.setItem("token", t)
        localStorage.setItem("username", u)
        toast({ title: "Account created", description: `Welcome, ${u}!` })
        router.push("/journal")
      } else {
        toast({ title: "Account created", description: "Please log in with your new credentials." })
        router.push("/login")
      }
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.response?.data?.message || "Please try a different username.",
        variant: "destructive",
      })
      return
    }
  }

  const updateUser: AuthContextType["updateUser"] = async (payload) => {
    try {
      const res = await api.put("/user", payload)
      if (res.status === 204 || res.status === 200) {
        if (payload.username) {
          setUsername(payload.username)
          localStorage.setItem("username", payload.username)
        }
        toast({ title: "Profile updated" })
      }
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Unable to update profile.",
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteUser = async () => {
    try {
      const res = await api.delete("/user")
      if (res.status === 204 || res.status === 200) {
        toast({ title: "Account deleted" })
        doLogout(true)
      }
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err?.response?.data?.message || "Unable to delete account.",
        variant: "destructive",
      })
      throw err
    }
  }

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      username,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      updateUser,
      deleteUser,
      logout: doLogout,
    }),
    [token, username, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
