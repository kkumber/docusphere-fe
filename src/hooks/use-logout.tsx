import { useUserContext } from '@/context/user-context'
import api from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

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
      toast.error('Logout failed: ' + error.message)
    },
  })

  return mutation
}

export default useLogoutUser
