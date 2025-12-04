import { useNavigate } from '@tanstack/react-router'
import { useUserContext } from '@/context/user-context'
import type { User } from '@/types/user'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, setUser } = useUserContext()

  const isAuthenticated = () => {
    return user !== null
  }

  const signIn = (userPayload: User) => {
    // In a real application, you'd get the user object from your authentication API response
    // For this example, we'll use a dummy user based on the payload
    setUser(userPayload)
    localStorage.setItem('isAuthenticated', 'true')
    navigate({ to: '/' })
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('isAuthenticated')
    navigate({ to: '/auth/login' })
  }

  return {
    isAuthenticated,
    signIn,
    signOut,
  }
}

export type AuthContext = ReturnType<typeof useAuth>
