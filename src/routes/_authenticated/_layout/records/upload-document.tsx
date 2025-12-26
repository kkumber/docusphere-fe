import UploadDocumentPage from '@/pages/document/upload-document-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/records/upload-document',
)({
  component: UploadDocumentRoute,
})

function UploadDocumentRoute() {
  return <UploadDocumentPage />
}
