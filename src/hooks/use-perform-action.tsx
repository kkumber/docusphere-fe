import api from '@/lib/api'
import type { ApiError, SuccessResponse } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export type ActionTypes =
  | 'acknowledge'
  | 'approve'
  | 'review'
  | 'sign'
  | 'respond'

const usePerformAction = () => {
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
        `Document ID:${variables.documentId} ${variables.action.toLowerCase()} successfully`,
      )
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
