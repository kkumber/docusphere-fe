import { Button } from '@/components/ui/button'
import {
  Check,
  CheckCircle2,
  Paperclip,
  PenLine,
  ClipboardCheck,
  ChevronDown,
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

interface Props {
  documentId: string
}

const DocumentActions = ({ documentId }: Props) => {
  const performActionMutation = usePerformAction()

  const handlePerformActionTask = (action: ActionTypes) => {
    performActionMutation.reset()
    performActionMutation.mutate({ documentId, action })
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

        {/* ATTACH */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          <Paperclip className="w-4 h-4" /> Attach file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DocumentActions
