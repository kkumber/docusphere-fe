import api from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Route } from '../routes/_authenticated/_layout'

const useLogoutUser = () => {
  const navigate = useNavigate()
  const authentication = Route.useRouteContext().authentication;

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/logout')
    },
    onSuccess: () => {
      navigate({ to: '/auth/login' })
      authentication.signOut();
    },
    onError: (error) => {
      toast.error('Logout failed: ' + error.message)
    },
  })

  return mutation
}

export default useLogoutUser
