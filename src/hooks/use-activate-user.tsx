import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import type { User } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useActivateUser = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<void, AxiosError<ApiError>, User>({
    mutationFn: async (user: User) => {
      const { data } = await api.patch(`/api/users/${user!.id}/activate`, user)
      return data.data
    },
    onSuccess: () => {
      toast.success('User activated successfully')
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: true,
        refetchType: 'active',
      })
    },
  })
  return mutation
}

export default useActivateUser
