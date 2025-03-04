"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type AdminContextType = {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
})

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is logged in on mount
    const adminAuth = localStorage.getItem("admin_auth")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (password: string) => {
    // In production, this should be a secure password check
    if (password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_auth")
  }

  return <AdminContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AdminContext.Provider>
}

export const useAdmin = () => useContext(AdminContext)

