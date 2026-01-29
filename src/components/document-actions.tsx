import { Button } from '@/components/ui/button'
import {
  Check,
  CheckCircle2,
  Paperclip,
  PenLine,
  ChevronDown,
  CheckCircle,
  Edit,
} from 'lucide-react'
import { ReusableAlertDialog } from '@/components/reusable-alert-dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import usePerformAction, { type ActionTypes } from '@/hooks/use-perform-action'
import useUploadAttachment from '@/hooks/use-upload-attachment'
import { useState } from 'react'
import useUploadReview from '@/hooks/use-upload-review'
import DocumentStatusWarningModal from './document-status-warning-modal'
import { Route } from '@/routes/__root'

interface Props {
  documentId: string
}

const DocumentActions = ({ documentId }: Props) => {
  const performActionMutation = usePerformAction()
  const uploadAttachFile = useUploadAttachment()
  const uploadReview = useUploadReview()
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [remarks, setRemarks] = useState<string>('')

  const { authentication } = Route.useRouteContext()

  const userRole = authentication.userRole()
  const canCompleteDocument =
    userRole === 'admin' || userRole === 'records' || userRole === 'sds'

  const handlePerformActionTask = (action: ActionTypes) => {
    performActionMutation.reset()
    performActionMutation.mutate({ documentId, action })
  }

  const handleUploadReview = () => {
    uploadReview.reset()
    uploadReview.mutate({ documentId, remarks })
    setRemarks('')
  }

  const handleAttachFile = () => {
    uploadAttachFile.reset()
    setFileError('')

    if (file === null) {
      return setFileError('Please select a file')
    }

    if (file?.type !== 'application/pdf') {
      return setFileError('Please upload a PDF file.')
    }

    const payload = {
      file: file,
      remarks: remarks,
    }

    uploadAttachFile.mutate({ documentId, payload })

    setFile(null)
    setRemarks('')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="default" className="flex gap-1 items-center">
          Actions
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* REVIEW / WRITE A REVIEW */}
        <ReusableAlertDialog
          title="Write a Review"
          description="Add your remarks or comments about this document before marking it as reviewed."
          confirmText="Submit Review"
          cancelText="Cancel"
          onConfirm={() => handleUploadReview()}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Write a Review
            </DropdownMenuItem>
          }
          additionalContent={
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-medium text-gray-800">
                Remarks / Comments
              </label>

              <textarea
                rows={3}
                placeholder="e.g. The document is accurate. Suggested edits on section 2."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setRemarks(e.target.value)}
                required
                minLength={20}
              />
            </div>
          }
        />

        {/* ACKNOWLEDGE */}
        <ReusableAlertDialog
          title="Acknowledge document"
          description="This will mark the document as acknowledged. You will not be able to undo this action."
          confirmText="Yes, acknowledge"
          cancelText="Cancel"
          onConfirm={() => handlePerformActionTask('acknowledge')}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Acknowledge
            </DropdownMenuItem>
          }
        />

        {/* APPROVE */}
        <ReusableAlertDialog
          title="Approve document"
          description="Approving this document finalizes the review process. This action cannot be undone."
          confirmText="Approve"
          onConfirm={() => handlePerformActionTask('approve')}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Approve
            </DropdownMenuItem>
          }
        />

        {/* SIGN */}
        <ReusableAlertDialog
          title="Sign document"
          description="Signing this document attaches your official digital signature when the document is downloaded and cannot be undone."
          confirmText="Sign document"
          onConfirm={() => handlePerformActionTask('sign')}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <PenLine className="w-4 h-4" /> Sign document
            </DropdownMenuItem>
          }
        />

        <DropdownMenuSeparator />

        {/* ATTACH FILE */}
        <ReusableAlertDialog
          title="Attach a file"
          description="Attach a supporting file and provide remarks or instructions related to it."
          confirmText="Attach file"
          cancelText="Cancel"
          onConfirm={() => handleAttachFile()}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <Paperclip className="w-4 h-4" />
              Attach file
            </DropdownMenuItem>
          }
          additionalContent={
            <div className="flex flex-col gap-8 mt-3">
              {/* File input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-800">
                  File to attach
                </label>

                <input
                  type="file"
                  accept="application/pdf"
                  className="w-full text-sm text-gray-700
                     file:border file:border-gray-300 file:rounded-md
                     file:px-3 file:py-2 file:text-sm file:font-medium
                     file:bg-gray-100 hover:file:bg-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] ?? null
                    setFile(selectedFile)
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  PDF files only. This file will be linked to the document.
                </p>
              </div>

              {/* Remarks / Instructions */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-800">
                  Remarks / Instructions
                </label>

                <textarea
                  rows={3}
                  placeholder="e.g. Please review page 3 and provide feedback on the highlighted section."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                />
              </div>

              {fileError && (
                <span className="text-sm text-destructive">{fileError}</span>
              )}
            </div>
          }
        />

        {!canCompleteDocument ? (
          <>
            <DropdownMenuSeparator />
            <DocumentStatusWarningModal documentId={documentId} />
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <ReusableAlertDialog
              title="Mark document as completed"
              description="This will mark the document as completed. Make sure all required actions have been performed. You will not be able to undo this action."
              confirmText="Yes, mark as completed"
              cancelText="Cancel"
              onConfirm={() => handlePerformActionTask('complete')}
              triggerButton={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Mark as Completed
                </DropdownMenuItem>
              }
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DocumentActions
