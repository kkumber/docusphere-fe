import { createContext, useContext, type SetStateAction } from 'react'
import type { User } from '@/types/user'

interface UserContext {
  user: User | null
  setUser: React.Dispatch<SetStateAction<User | null>>
}

export const UserContext = createContext<UserContext | null>(null)

export const useUserContext = (): UserContext => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider.')
  }
  return context
}
