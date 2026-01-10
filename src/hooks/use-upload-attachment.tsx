import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

type FileUpload = {
  documentId: string
  file: File
}

const useUploadAttachment = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<void, AxiosError<ApiError>, FileUpload>({
    mutationFn: async ({ documentId, file }) => {
      await api.post(
        `/api/document-actions/document/${documentId}/respond`,
        {
          file: file,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },
    onSuccess: (_data, { documentId }) => {
      toast.success('Attachment uploaded successfully')
      queryClient.invalidateQueries({
        queryKey: ['documentAttachments', documentId.toString()],
        exact: true,
        refetchType: 'active',
      })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Attachment upload failed: ' + error.response?.data.message)
      }
    },
  })
  return mutation
}

export default useUploadAttachment
