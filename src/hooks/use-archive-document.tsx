import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const useArchiveDocument = () => {
  const queryClient = useQueryClient()
  const { authentication } = useRouteContext({
    from: '/_authenticated/_layout/documents/document-management',
  })
  const userRole = authentication.userRole()

  const mutation = useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: (documentId) =>
      api.patch(`/api/record/documents/${documentId}/archive`),
    onSuccess: () => {
      toast.success('Document is now in archives')
      queryClient.invalidateQueries({
        queryKey: ['documents', userRole],
        exact: true,
        refetchType: 'active',
      })
    },
    onError: (error) => toast.error(error.response?.data.message),
  })

  return mutation
}

export default useArchiveDocument
