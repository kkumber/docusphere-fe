import { useNavigate } from '@tanstack/react-router'

const useAuth = () => {
  const navigate = useNavigate()

  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true'
  }

  const signIn = () => {
    localStorage.setItem('isAuthenticated', 'true')
    if (!isAuthenticated()) {
      throw new Error('Sign in failed')
    }
    navigate({ to: '/' })
  }

  const signOut = () => {
    localStorage.removeItem('isAuthenticated')
    if (isAuthenticated()) {
      throw new Error('Sign out failed')
    }
    navigate({ to: '/auth/login' })
  }

  return {
    isAuthenticated,
    signIn,
    signOut,
  }
}
