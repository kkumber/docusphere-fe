import { Button } from '@/components/ui/button'
import {
  Check,
  CheckCircle2,
  Paperclip,
  PenLine,
  ChevronDown,
  CheckCircle,
  Edit,
  XCircle,
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
import useRejectDocument from '@/hooks/use-reject-document'
import { Input } from './ui/input'
import useSignDocument from '@/hooks/use-sign-document'

interface Props {
  documentId: string
  status_id?: number
}

const DocumentActions = ({ documentId, status_id }: Props) => {
  const performActionMutation = usePerformAction()
  const uploadAttachFile = useUploadAttachment()
  const uploadReview = useUploadReview()
  const rejectDocument = useRejectDocument()
  const signDocument = useSignDocument()

  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [remarks, setRemarks] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { authentication } = Route.useRouteContext()

  const userRole = authentication.userRole()
  const canCompleteDocument =
    userRole === 'admin' || userRole === 'records' || userRole === 'sds'
  const canRejectDocument =
    userRole === 'sds' ||
    (userRole === 'records' && [20, 21].includes(status_id!)) // 20 is draft approved, 21 is for issuance

  const handlePerformActionTask = (action: ActionTypes) => {
    performActionMutation.reset()
    performActionMutation.mutate({ documentId, action })
  }

  const handleUploadReview = () => {
    uploadReview.reset()
    uploadReview.mutate({ documentId, remarks })
    setRemarks('')
  }

  const handleRejectDocument = () => {
    rejectDocument.reset()
    rejectDocument.mutate({ documentId, remarks })
    setRemarks('')
  }

  const handleSignDocument = () => {
    signDocument.reset()
    signDocument.mutate({ documentId, password })
    setPassword('')
  }

  const handleAttachFile = () => {
    uploadAttachFile.reset()
    setFileError('')

    if (file === null) {
      return setFileError('Please select a file.')
    }

    if (file?.type !== 'application/pdf') {
      return setFileError('Only PDF files are allowed.')
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
        {/* REVIEW */}
        <ReusableAlertDialog
          title="Add review or comments"
          description="Provide internal remarks, observations, or recommendations regarding this document. These comments will be recorded as part of the review history."
          confirmText="Submit review"
          cancelText="Cancel"
          onConfirm={() => handleUploadReview()}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Add review
            </DropdownMenuItem>
          }
          additionalContent={
            <div className="flex flex-col gap-3 mt-3">
              <label className="text-sm font-medium text-gray-800">
                Review remarks
              </label>

              <textarea
                rows={4}
                placeholder="State your findings, suggested revisions, or comments relevant to this document."
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
          description="This confirms that you have received and reviewed the document. No further action will be required from you after acknowledgment."
          confirmText="Acknowledge"
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
          description="Approving this document signifies that it meets all requirements and is cleared to proceed. This action is final and cannot be reversed."
          confirmText="Approve document"
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
          description="Signing will apply your official digital signature when the document is downloaded or finalized. This action is permanent."
          confirmText="Sign document"
          onConfirm={() => handleSignDocument()}
          additionalContent={
            <div className="flex flex-col gap-3 mt-3">
              <label className="text-sm font-medium text-gray-800">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          }
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <PenLine className="w-4 h-4" /> Sign
            </DropdownMenuItem>
          }
        />

        <DropdownMenuSeparator />

        {/* ATTACH FILE */}
        <ReusableAlertDialog
          title="Attach supporting document"
          description="Upload a related or supporting PDF file and provide context or instructions associated with the attachment."
          confirmText="Attach file"
          cancelText="Cancel"
          onConfirm={() => handleAttachFile()}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <Paperclip className="w-4 h-4" /> Attach file
            </DropdownMenuItem>
          }
          additionalContent={
            <div className="flex flex-col gap-6 mt-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">
                  Supporting PDF file
                </label>

                <input
                  type="file"
                  accept="application/pdf"
                  className="w-full text-sm text-gray-700
                  file:border file:border-gray-300 file:rounded-md
                  file:px-3 file:py-2 file:text-sm file:font-medium
                  file:bg-gray-100 hover:file:bg-gray-200"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] ?? null
                    setFile(selectedFile)
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  Only PDF files are accepted.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">
                  Remarks / instructions
                </label>

                <textarea
                  rows={3}
                  placeholder="Describe the purpose of this attachment or provide instructions for review."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        <DropdownMenuSeparator />

        {canCompleteDocument ? (
          <DocumentStatusWarningModal documentId={documentId} />
        ) : (
          <ReusableAlertDialog
            title="Mark assignment as completed"
            description="This indicates that all assigned actions related to this document have been completed. This status cannot be changed once confirmed."
            confirmText="Mark as completed"
            cancelText="Cancel"
            onConfirm={() => handlePerformActionTask('complete')}
            triggerButton={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Mark as completed
              </DropdownMenuItem>
            }
          />
        )}

        {/* REJECT */}
        {canRejectDocument && (
          <>
            <DropdownMenuSeparator />
            <ReusableAlertDialog
              title="Reject document"
              description="Rejecting this document will permanently terminate its workflow. The document will no longer be routed, reviewed, or acted upon. This action is irreversible."
              confirmText="Reject document"
              cancelText="Cancel"
              onConfirm={() => handleRejectDocument()}
              triggerButton={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-destructive"
                >
                  <XCircle className="w-4 h-4 text-destructive" /> Reject
                </DropdownMenuItem>
              }
              additionalContent={
                <div className="flex flex-col gap-3 mt-3">
                  <label className="text-sm font-medium text-gray-800">
                    Reason for rejection
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Clearly state the reason for rejection and any required corrective action."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setRemarks(e.target.value)}
                    required
                    minLength={20}
                  />
                </div>
              }
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DocumentActions
