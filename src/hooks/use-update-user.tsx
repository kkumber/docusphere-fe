import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import type { User } from '@/types/user'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useUpdateUser = () => {
  const mutation = useMutation<void, AxiosError<ApiError>, User>({
    mutationFn: async (user: User) => {
      const { data } = await api.put(`/api/users/${user!.id}`, user)
      return data.data
    },
    onSuccess: () => {
      toast.success('User updated successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('User update failed: ' + error.message)
      }
    },
  })

  return mutation
}

export default useUpdateUser
