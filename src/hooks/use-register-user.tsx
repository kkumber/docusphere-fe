import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'
import type { UserRegister } from '@/types/user'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types/response'

const useRegisterUser = () => {
  const mutation = useMutation<void, AxiosError<ApiError>, UserRegister>({
    mutationFn: async (userData: UserRegister) => {
      const { data } = await api.post('/register', userData)
      return data.data
    },
    onSuccess: () => {
      toast.success('User registered successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('User registration failed: ' + error.message)
      }
    },
  })

  return mutation
}

export default useRegisterUser
