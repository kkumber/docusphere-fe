import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { getRouteApi } from '@tanstack/react-router'
import { PdfViewer } from '@/components/pdf-viewer'
import { Button } from '@/components/ui/button'
import {
  Check,
  CheckCircle2,
  Paperclip,
  Info,
  PenLine,
  ClipboardCheck,
} from 'lucide-react'
import { ReusableAlertDialog } from '@/components/reusable-alert-dialog'
import type { Document } from '@/types/document'
import useGetRequest from '@/hooks/use-get'
import DocumentInformation from '@/components/document-information'
import useAcknowledgeTask from '@/hooks/use-acknowledge-task'

interface DocumentDetails {
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
  const documentId = document.id.toString()

  const {
    isPending,
    data: documentDetails,
    error,
    isError,
  } = useGetRequest<DocumentDetails>({
    url: `/api/document-actions/document/${document.id}/details`,
    key: ['documentActions', document.id],
  })

  const errorDetailsMsg = isError ? error?.message : ''

  // MUTATION HOOKS
  const acknowledgeTask = useAcknowledgeTask()

  const handleAcknowledgeTask = () => {
    acknowledgeTask.mutate(documentId)
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {/* Top info + actions */}
        <div className="my-4 block md:flex md:flex-col md:items-center md:justify-between gap-2 sm:gap-0">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-semibold">{document.title}</h3>
            <h5 className="text-sm text-muted-foreground">
              {document.tracking_no}
            </h5>
          </div>

          <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
            {/* APPROVE */}
            <ReusableAlertDialog
              title="Approve document"
              description="Approving this document finalizes the review process. This action cannot be undone."
              confirmText="Approve"
              onConfirm={() => {
                // approve mutation here
              }}
              triggerButton={
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Approve
                </Button>
              }
            />

            {/* ACKNOWLEDGE */}
            <ReusableAlertDialog
              title="Acknowledge document"
              description="This will mark the document as acknowledged. You will not be able to undo this action."
              confirmText="Yes, acknowledge"
              cancelText="Cancel"
              onConfirm={handleAcknowledgeTask}
              triggerButton={
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-500/80"
                >
                  <CheckCircle2 className="w-4 h-4" /> Acknowledge
                </Button>
              }
            />

            {/* REVIEWED */}
            <ReusableAlertDialog
              title="Mark as reviewed"
              description="This will mark the document as reviewed."
              confirmText="Mark as reviewed"
              onConfirm={() => {
                // review mutation
              }}
              triggerButton={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ClipboardCheck className="w-4 h-4" /> Review
                </Button>
              }
            />

            {/* ATTACH FILE */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {' '}
              <Paperclip className="w-4 h-4" /> Attach File{' '}
            </Button>

            {/* LEGAL / IRREVERSIBLE */}
            <ReusableAlertDialog
              title="Sign document"
              description="Signing this document applies your official digital signature and cannot be undone."
              confirmText="Sign document"
              onConfirm={() => {
                // sign mutation
              }}
              triggerButton={
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <PenLine className="w-4 h-4" /> Sign
                </Button>
              }
            />

            {/* INFO */}
            <ReusableAlertDialog
              triggerButton={
                <Button
                  variant="link"
                  size="sm"
                  className="flex items-center gap-1 p-0"
                >
                  <Info className="w-4 h-4" /> More Details
                </Button>
              }
              title={document.title}
              description="More information regarding the document"
              additionalContent={
                <DocumentInformation
                  isPending={isPending}
                  documentDetails={documentDetails?.data}
                  error={errorDetailsMsg}
                />
              }
            />
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-secondary md:p-8 rounded-md shadow-sm">
          <PdfViewer pdfUrl={data.data.url} user={data.data.user} />
        </div>
      </MainContainer>
    </>
  )
}

export default DocumentView
