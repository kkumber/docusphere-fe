import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useSignDocument = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    void,
    AxiosError<ApiError>,
    { documentId: string; password: string }
  >({
    mutationFn: async ({ documentId, password }) => {
      await api.patch(`/api/document-actions/document/${documentId}/sign`, {
        password,
      })
    },
    onSuccess: (_data, { documentId }) => {
      toast.success('Document Signed')
      queryClient.invalidateQueries({
        queryKey: ['documentLogs', documentId.toString()],
        exact: true,
        refetchType: 'active',
      })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Signature failed: ' + error.response?.data.message)
      }
    },
  })
  return mutation
}

export default useSignDocument
