"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AuthService, ApiUtilisateur } from "@/lib/auth-service"

interface AuthContextType {
  user: ApiUtilisateur | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ApiUtilisateur | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        setUser(AuthService.getCurrentUser())
        setIsLoading(false)
      } else {
        setUser(null)
        setIsLoading(false)
        
        // Redirect to login if accessing protected route
        if (pathname.startsWith('/dashboard')) {
          router.push('/login')
        }
      }
    }
    
    checkAuth()
  }, [pathname, router])

  const logout = () => {
    AuthService.logout()
    setUser(null)
    router.push('/login')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}