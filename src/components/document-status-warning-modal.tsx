import * as React from 'react'
import { ReusableAlertDialog } from './reusable-alert-dialog'
import useGetRequest from '@/hooks/use-get'
import type { Response } from '@/types/response'
import { DropdownMenuItem } from './ui/dropdown-menu'
import { CheckCircle } from 'lucide-react'
import usePerformAction, { type ActionTypes } from '@/hooks/use-perform-action'

type AssignmentWarningResponse = {
  id: number
  request_type: string
  status: string
  assignee: {
    id: number
    name: string
    role: string
    office: string
  }
}

type Props = {
  documentId: string
}

/**
 * Warning modal shown before confirming an action on a document
 */
const DocumentStatusWarningModal: React.FC<Props> = ({ documentId }) => {
  const {
    data: documentAssignmentStatus,
    isError,
    error,
    isPending,
  } = useGetRequest<Response<AssignmentWarningResponse[]>>({
    url: `/api/document/${documentId}/assignment-status`,
    key: ['documentAssignmentStatus', documentId],
  })

  const performActionMutation = usePerformAction()

  const handlePerformActionTask = (action: ActionTypes) => {
    performActionMutation.reset()
    performActionMutation.mutate({ documentId, action })
  }

  if (!documentAssignmentStatus) return null

  return (
    <ReusableAlertDialog
      title="Pending Assignments Warning"
      description="This action will mark the document as Completed and notify the Records Office. Some related assignments are not yet completed and will remain unresolved. Do you wish to continue?"
      confirmText="Confirm"
      cancelText="Cancel"
      onConfirm={() => handlePerformActionTask('complete')}
      disableOutsideClick={true}
      triggerButton={
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Mark as Completed
        </DropdownMenuItem>
      }
      contentClassName="max-w-xl"
      additionalContent={
        <div className="mt-4 space-y-3">
          {isPending && (
            <p className="text-sm text-gray-500">
              Loading pending assignments…
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load assignments.
              {error && ` (${error.message})`}
            </p>
          )}

          {!isPending && documentAssignmentStatus?.data?.length === 0 && (
            <p className="text-sm text-gray-500">
              No pending assignments for this document.
            </p>
          )}

          {!isPending && documentAssignmentStatus?.data?.length > 0 && (
            <ul className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded p-2">
              {documentAssignmentStatus.data.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {assignment.request_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Assigned to: {assignment.assignee.name} (
                      {assignment.assignee.role})
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {assignment.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  )
}

export default DocumentStatusWarningModal
