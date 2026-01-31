import type { User } from '@/types/user'
import { useState } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = () => {
    const loggedIn = localStorage.getItem('isAuthenticated')
    return loggedIn ? JSON.parse(loggedIn) : false
  }

  const signIn = (userPayload: User) => {
    setUser(userPayload)
    localStorage.setItem('isAuthenticated', JSON.stringify('true'))
    localStorage.setItem('userRole', JSON.stringify(userPayload?.role))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
  }

  const userRole = () => {
    try {
      const user = localStorage.getItem('userRole')
      if (!user || user === 'undefined') return null
      return JSON.parse(user)
    } catch {
      return null
    }
  }

  return {
    isAuthenticated,
    signIn,
    signOut,
    userRole,
    setUser,
    user,
  }
}

export type AuthContext = ReturnType<typeof useAuth>
