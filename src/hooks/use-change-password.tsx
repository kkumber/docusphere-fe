import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

interface PasswordChangeRequest {
  current_password: string
  password: string
  password_confirmation: string
}

const useChangePassword = () => {
  const mutation = useMutation<
    void,
    AxiosError<ApiError>,
    PasswordChangeRequest
  >({
    mutationFn: async (payload: PasswordChangeRequest) => {
      const { data } = await api.post('/change-password', payload)
      return data.data
    },
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Password change failed: ' + error.response?.data.message)
      }
    },
  })

  return mutation
}

export default useChangePassword
