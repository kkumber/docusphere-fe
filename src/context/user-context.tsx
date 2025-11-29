import { createContext, useContext, type SetStateAction } from 'react'
import type { User } from '@/types/user'

interface UserContext {
  user: User | null
  setUser: React.Dispatch<SetStateAction<User | null>>
}

export const UserContext = createContext<UserContext | null>(null)

export const useUserContext = () => {
  return useContext(UserContext)
}
