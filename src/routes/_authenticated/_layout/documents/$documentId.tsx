import api from '@/lib/api'
import DocumentView from '@/pages/document/document-view'
import type { Document } from '@/types/document'
import type { User } from '@/types/user'
import { createFileRoute } from '@tanstack/react-router'

interface DocumentResponse {
  user: User
  document: Document
  url: string
}

export const Route = createFileRoute(
  '/_authenticated/_layout/documents/$documentId',
)({
  component: DocumentViewRoute,
  loader: async ({ params }) => {
    const response = await api.get<{ data: DocumentResponse }>(
      '/api/documents/' + params.documentId,
    )
    return response.data
  },
})

function DocumentViewRoute() {
  return <DocumentView />
}
