import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { getRouteApi } from '@tanstack/react-router'
import { PdfViewer } from '@/components/pdf-viewer'
import type { Document } from '@/types/document'
import useGetRequest from '@/hooks/use-get'

import DocumentActions from '@/components/document-actions'
import DocumentDetails from '@/components/document-details'
import usePrefetchRequest from '@/hooks/use-prefetch-request'

import { Download, Files, Info } from 'lucide-react'
import { downloadSignedPdf } from '@/lib/download-signed-pdf'
import { Route } from '@/routes/__root'
import { DocumentStatusMap } from '@/lib/document-status-map'

interface DocumentDetailsResponse {
  data: {
    document: {
      tracking_no: string
      title: string
      category: string
      originating_office: string
      request_type: string
      uploaded_by: string
      created_at: string
      updated_at: string
    }
    assignment: {
      assigned_by: string
      request_type: string
      due_date: string | null
      instructions: string | null
      status: string
    }
  }
}

const breadcrumbs: Breadcrumbs[] = [
  { title: 'Document Management', href: '/documents/document-management' },
  { title: 'View Document', href: '#' },
]

const route = getRouteApi('/_authenticated/_layout/documents/$documentId')

const DocumentView = () => {
  const data = route.useLoaderData()
  const document: Document = data.data.document
  const { authentication } = Route.useRouteContext()
  const userRole = authentication.userRole()
  const allowedRoleForDownload = ['admin', 'records', 'sds']

  const {
    isPending,
    data: documentDetails,
    error,
    isError,
  } = useGetRequest<DocumentDetailsResponse>({
    url: `/api/document-actions/document/${document.id}/details`,
    key: ['documentDetails', document.id],
  })

  const uploadedBy = documentDetails?.data.document.uploaded_by

  const errorDetailsMsg = isError ? error?.message : null
  const isDraftReadyForRecords =
    document.status_id === DocumentStatusMap.DOC_DRAFT_APPROVED ||
    document.status_id === DocumentStatusMap.DOC_PENDING ||
    document.status_id === DocumentStatusMap.DOC_RETURNED

  const terminalStatuses = [
    DocumentStatusMap.DOC_COMPLETED,
    DocumentStatusMap.DOC_ARCHIVED,
    DocumentStatusMap.DOC_REJECTED,
  ]
  const isDocTerminal = terminalStatuses.includes(document.status_id!)

  const draftStatuses = [
    DocumentStatusMap.DOC_DRAFT_PENDING,
    DocumentStatusMap.DOC_DRAFT_IN_REVIEW,
    DocumentStatusMap.DOC_DRAFT_APPROVED,
    DocumentStatusMap.DOC_RETURNED,
  ]
  const isDraft =
    draftStatuses.includes(document.status_id!) ||
    document.tracking_no.startsWith('DRAFT-')

  // prefetch attachments and actions/logs
  usePrefetchRequest({
    key: ['documentAttachments', document.id.toString()],
    url: `/api/document/${document.id}/attachments`,
  })
  usePrefetchRequest({
    key: ['documentLogs', document.id.toString()],
    url: `/api/document/${document.id}/actions`,
  })

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {/* DOCUMENT CONTEXT HEADER */}
        <div className="space-y-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Icon + Document Info */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-blue/10 p-2">
                <Files className="h-6 w-6 text-primary-blue" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {document.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Tracking No: {document.tracking_no}
                </p>
              </div>
            </div>

            {/* Actions + Download */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Document Actions Dropdown */}

              {userRole !== 'records' && !isDocTerminal && (
                <DocumentActions
                  documentId={document.id.toString()}
                  uploaded_by={uploadedBy}
                  isDraft={isDraft}
                />
              )}

              {userRole === 'records' && isDraftReadyForRecords && (
                <DocumentActions
                  documentId={document.id.toString()}
                  status_id={document.status_id}
                  isDraft={isDraft}
                />
              )}

              {/* Document Details Modal */}
              <DocumentDetails
                title={document.title}
                isPending={isPending}
                documentDetails={documentDetails?.data}
                error={isError ? error?.message! : ''}
                pdfUrl={data.data.url}
              />

              {/* Download Signed PDF */}
              {allowedRoleForDownload.includes(userRole) && (
                <button
                  onClick={() =>
                    downloadSignedPdf(
                      data.data.url,
                      document.id,
                      document.title,
                    )
                  }
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  title="Download Signed PDF"
                >
                  <Download className="h-5 w-5 text-primary" />
                </button>
              )}
            </div>
          </div>

          {/* Assignment & Workflow Info Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3">
            <Info className="mt-0.5 h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-900">
              Review and act on this document. You can approve, reject,
              acknowledge, sign, review, attach files or check attachments and
              logs. All workflow details are displayed for your reference.
            </p>
          </div>
        </div>

        {/* PDF Viewer */}
        <PdfViewer pdfUrl={data.data.url} user={data.data.user} />
      </MainContainer>
    </>
  )
}

export default DocumentView
