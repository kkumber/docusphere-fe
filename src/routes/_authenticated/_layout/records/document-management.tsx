import DocumentManagementPage from '@/pages/document-management-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/records/document-management',
)({
  component: DocumentManagementRoute,
})

function DocumentManagementRoute() {
  return <DocumentManagementPage />
}
