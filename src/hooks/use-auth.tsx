import type { User } from '@/types/user'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    api
      .get('/api/user')
      .then((res) => {
        console.log(res.data)
        signIn(res.data.data)
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error Message: ', error.response.data)
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
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('isAuthenticated')
  }

  return {
    isAuthenticated,
    signIn,
    signOut,
    setUser,
    user,
  }
}

export type AuthContext = ReturnType<typeof useAuth>
