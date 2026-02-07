import api from '@/lib/api'
import { Route } from '@/routes/__root'
import type { ApiError } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

interface Payload {
  document_id: number
  request_type: string
  assigned_to: number[]
  instructions: string
}

const useAssignDoc = () => {
  const queryClient = useQueryClient()
  const { authentication } = Route.useRouteContext()
  const userRole = authentication.userRole()

  const mutation = useMutation<void, AxiosError<ApiError>, Payload>({
    mutationFn: async (payload: Payload) => {
      const { data } = await api.post('/api/document/assignments', payload)
      return data.data
    },
    onSuccess: () => {
      toast.success('Document assigned successfully')
      queryClient.invalidateQueries({
        queryKey: ['documents', userRole],
        exact: true,
        refetchType: 'active',
      })
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
