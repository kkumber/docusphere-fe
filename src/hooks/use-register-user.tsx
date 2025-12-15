import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

type UserRegister = {
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
  office: string
}

const useRegisterUser = () => {
  const mutation = useMutation({
    mutationFn: async (userData: UserRegister) => {
      const { data } = await api.post('/register', userData)
      return data.data
    },
    onSuccess: () => {},
  })

  return mutation
}

export default useRegisterUser
