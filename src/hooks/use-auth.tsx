import type { User } from '@/types/user'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    api
      .get('/api/user')
      .then((res) => {
        signIn(res.data.data)
      })
      .catch((error) => {
        if (error.response) {
          signOut()
        }
      })
  }, [])

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
    const user = localStorage.getItem('userRole')
    return user ? JSON.parse(user) : null
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
