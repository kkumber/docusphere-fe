import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useRejectDocument = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    void,
    AxiosError<ApiError>,
    { documentId: string; remarks: string }
  >({
    mutationFn: async ({ documentId, remarks }) => {
      await api.post(`/api/document-actions/document/${documentId}/reject`, {
        remarks,
      })
    },
    onSuccess: (_data, { documentId }) => {
      toast.success('Document Rejected')
      queryClient.invalidateQueries({
        queryKey: ['documentLogs', documentId.toString()],
        exact: true,
        refetchType: 'active',
      })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Rejection failed: ' + error.response?.data.message)
      }
    },
  })
  return mutation
}

export default useRejectDocument
