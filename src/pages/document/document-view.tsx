import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { getRouteApi } from '@tanstack/react-router'
import { PdfViewer } from '@/components/pdf-viewer'
import { Button } from '@/components/ui/button'
import { Check, CheckCircle2, Paperclip, Info } from 'lucide-react'
import { QueryClient } from '@tanstack/react-query'
import usePrefetchRequest from '@/hooks/use-prefetch-request'

const breadcrumbs: Breadcrumbs[] = [
  { title: 'Document Management', href: '/documents/document-management' },
  { title: 'View Document', href: '#' },
]

const route = getRouteApi('/_authenticated/_layout/documents/$documentId')

const DocumentView = () => {
  const data = route.useLoaderData()
  const document = data.data.document

  usePrefetchRequest({
    key: ['documentDetails', document.tracking_no],
    url: `/api/document-actions/${document.doc_assignment_id}`,
  })

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {/* Top info + actions */}
        <div className="my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <h3 className="text-xl font-semibold">{document.title}</h3>
            <h5 className="text-sm text-muted-foreground">
              {document.tracking_no}
            </h5>
          </div>

          <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Approve
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-500/60"
            >
              <CheckCircle2 className="w-4 h-4" /> Acknowledge
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Paperclip className="w-4 h-4" /> Attach File
            </Button>
            <Button
              variant="link"
              size="sm"
              className="flex items-center gap-1 p-0"
            >
              <Info className="w-4 h-4" /> More Details
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-secondary p-8 rounded-md shadow-sm">
          <PdfViewer pdfUrl={data.data.url} user={data.data.user} />
        </div>
      </MainContainer>
    </>
  )
}

export default DocumentView
