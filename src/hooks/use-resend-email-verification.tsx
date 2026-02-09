import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types/response'

const useSendEmailVerification = () => {
  const mutation = useMutation<
    { message: string },
    AxiosError<ApiError>,
    { email: string }
  >({
    mutationFn: async (email) => {
      const { data } = await api.post('/email/verification-notification', {
        email: email,
      })
      return data
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.response?.data.message)
      }
    },
  })

  return mutation
}

export default useSendEmailVerification
