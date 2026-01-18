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

import { Download } from 'lucide-react'
import { downloadSignedPdf } from '@/lib/download-signed-pdf'
import { Route } from '@/routes/__root'

interface DocumentDetailsResponse {
  data: {
    document: {
      tracking_no: string
      title: string
      category: string
      originating_office: string
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

  const errorDetailsMsg = isError ? error?.message : null

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
        {/* Title + Controls */}
        <div className="my-4 flex flex-col gap-3 z-20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* Title */}
            <div>
              <h3 className="text-xl font-semibold">{document.title}</h3>
              <p className="text-sm text-muted-foreground">
                {document.tracking_no}
              </p>
            </div>

            {/* Actions + Details */}
            <div className="flex items-center gap-2">
              {/* Document Actions */}
              <DocumentActions documentId={document.id.toString()} />

              {/* Document Details Modal */}
              <DocumentDetails
                title={document.title}
                isPending={isPending}
                documentDetails={documentDetails?.data}
                error={errorDetailsMsg!}
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
                  <Download className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <PdfViewer pdfUrl={data.data.url} user={data.data.user} />
      </MainContainer>
    </>
  )
}

export default DocumentView
