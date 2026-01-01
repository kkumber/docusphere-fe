import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

interface Payload {
  document_id: number
  request_type: string
  assigned_to: number[]
  instructions: string
}

const useAssignDoc = () => {
  const mutation = useMutation<void, AxiosError<ApiError>, Payload>({
    mutationFn: async (payload: Payload) => {
      const { data } = await api.post('/api/document/assignments', payload)
      return data.data
    },
    onSuccess: () => {
      toast.success('Document assigned successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Document assignment failed: ' + error.message)
      }
    },
  })

  return mutation
}

export default useAssignDoc
