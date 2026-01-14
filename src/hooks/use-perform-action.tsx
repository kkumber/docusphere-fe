import api from '@/lib/api'
import type { ApiError, SuccessResponse } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export type ActionTypes =
  | 'acknowledge'
  | 'approve'
  | 'review'
  | 'sign'
  | 'respond'
  | 'complete'

const usePerformAction = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    SuccessResponse<null>,
    AxiosError<ApiError>,
    { documentId: string; action: ActionTypes }
  >({
    mutationFn: async ({ documentId, action }) => {
      const { data } = await api.patch(
        `/api/document-actions/document/${documentId}/${action}`,
      )
      return data.data
    },
    onSuccess: (_data, variables) => {
      toast.success(
        `Document ID:${variables.documentId} ${variables.action.toLowerCase()} successful`,
      )
      queryClient.invalidateQueries({
        queryKey: ['documentLogs', variables.documentId],
        exact: true,
        refetchType: 'active',
      })
      queryClient.invalidateQueries({
        queryKey: ['documentDetails', variables.documentId],
        exact: true,
        refetchType: 'active',
      })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Document action failed: ' + error.response?.data.message)
      }
    },
  })

  return mutation
}

export default usePerformAction
