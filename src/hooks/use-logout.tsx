import api from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

const useLogoutUser = () => {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async () => {
      api.post('/logout')
    },
    onSuccess: () => {
      navigate({ to: '/auth/login' })
    },
    onError: (error) => {
      console.error('Logout failed', error)
    },
  })

  return mutation
}

export default useLogoutUser
