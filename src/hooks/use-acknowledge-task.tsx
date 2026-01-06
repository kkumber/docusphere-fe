import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useAcknowledgeTask = () => {
  const mutation = useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: async (documentId) => {
      const { data } = await api.patch(
        `/api/document-actions/document/${documentId}/acknowledge`,
      )
      console.log('Data: ' + data)
      return data.data
    },
    onSuccess: () => {
      toast.success('Task acknowledged')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Task acknowledge failed: ' + error.response?.data.message)
      }
    },
  })

  return mutation
}

export default useAcknowledgeTask
