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
  ChevronDown,
} from 'lucide-react'
import { ReusableAlertDialog } from '@/components/reusable-alert-dialog'
import type { Document } from '@/types/document'
import useGetRequest from '@/hooks/use-get'
import DocumentInformation from '@/components/document-information'
import { type ActionTypes } from '@/hooks/use-perform-action'
import usePerformAction from '@/hooks/use-perform-action'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

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

  const performActionMutation = usePerformAction()

  const handlePerformActionTask = (action: ActionTypes) => {
    performActionMutation.reset()
    performActionMutation.mutate({ documentId, action })
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {/* Title + Actions */}
        <div className="my-4 flex flex-col gap-3 z-20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* Title */}
            <div>
              <h3 className="text-xl font-semibold">{document.title}</h3>
              <p className="text-sm text-muted-foreground">
                {document.tracking_no}
              </p>
            </div>

            {/* Actions + More Details */}
            <div className="flex items-center gap-2">
              {/* ACTIONS DROPDOWN (FIRST) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="default" className="flex gap-1">
                    Actions
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {/* Review */}
                  <ReusableAlertDialog
                    title="Mark as reviewed"
                    description="This will mark the document as reviewed."
                    confirmText="Mark as reviewed"
                    onConfirm={() => handlePerformActionTask('review')}
                    triggerButton={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        Mark as reviewed
                      </DropdownMenuItem>
                    }
                  />

                  {/* Acknowledge */}
                  <ReusableAlertDialog
                    title="Acknowledge document"
                    description="This will mark the document as acknowledged. You will not be able to undo this action."
                    confirmText="Yes, acknowledge"
                    cancelText="Cancel"
                    onConfirm={() => handlePerformActionTask('acknowledge')}
                    triggerButton={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Acknowledge
                      </DropdownMenuItem>
                    }
                  />

                  <DropdownMenuSeparator />

                  {/* Approve */}
                  <ReusableAlertDialog
                    title="Approve document"
                    description="Approving this document finalizes the review process. This action cannot be undone."
                    confirmText="Approve"
                    onConfirm={() => handlePerformActionTask('approve')}
                    triggerButton={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                    }
                  />

                  {/* Attach */}
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach file
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Sign */}
                  <ReusableAlertDialog
                    title="Sign document"
                    description="Signing this document applies your official digital signature and cannot be undone."
                    confirmText="Sign document"
                    onConfirm={() => handlePerformActionTask('sign')}
                    triggerButton={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <PenLine className="w-4 h-4 mr-2" />
                        Sign document
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* MORE DETAILS (SECOND, PRIMARY USE) */}
              <ReusableAlertDialog
                triggerButton={
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    More Details
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
        </div>

        {/* PDF Viewer */}
        <PdfViewer pdfUrl={data.data.url} user={data.data.user} />
      </MainContainer>
    </>
  )
}

export default DocumentView
