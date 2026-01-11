import { Button } from '@/components/ui/button'
import {
  Check,
  CheckCircle2,
  Paperclip,
  PenLine,
  ClipboardCheck,
  ChevronDown,
  CheckCircle,
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

interface Props {
  documentId: string
}

const DocumentActions = ({ documentId }: Props) => {
  const performActionMutation = usePerformAction()
  const uploadAttachFile = useUploadAttachment()
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')

  const handlePerformActionTask = (action: ActionTypes) => {
    performActionMutation.reset()
    performActionMutation.mutate({ documentId, action })
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

    uploadAttachFile.mutate({ documentId, file })

    setFile(null)
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
          title="Mark as reviewed"
          description="This will mark the document as reviewed."
          confirmText="Mark as reviewed"
          onConfirm={() => handlePerformActionTask('review')}
          triggerButton={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" /> Mark as reviewed
            </DropdownMenuItem>
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
          description="Signing this document applies your official digital signature and cannot be undone."
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
          description="Select a file to attach to this document."
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
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="file"
                accept="application/pdf"
                className="w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded-md
                           file:px-3 file:py-2 file:text-sm file:font-medium
                           file:bg-gray-100 hover:file:bg-gray-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0])
                  } else {
                    setFile(null)
                  }
                }}
              />

              {fileError && (
                <span className="text-sm text-destructive">{fileError}</span>
              )}
            </div>
          }
        />

        <DropdownMenuSeparator />

        {/* MARK AS COMPLETED */}
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DocumentActions
