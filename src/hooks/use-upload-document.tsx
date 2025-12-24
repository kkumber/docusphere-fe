import type { DocumentFormState } from '@/components/document-register-form'
import api from '@/lib/api'
import type { ApiError } from '@/types/response'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { Document, DocumentFile } from '@/types/document'
import { toast } from 'sonner'

type DocumentUploadResponse = {
  document: Document
  file: DocumentFile
}

const useUploadDocument = () => {
  const mutation = useMutation<
    DocumentUploadResponse,
    AxiosError<ApiError>,
    DocumentFormState
  >({
    mutationFn: async (document: DocumentFormState) => {
      const { data } = await api.post('/api/record/documents', document, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return data.data
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Document upload failed: ' + error.message)
      }
    },
  })

  return mutation
}

export default useUploadDocument
