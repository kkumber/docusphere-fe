import type { Document } from '@/types/document'
import type { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Eye, Send, Archive, Clock, MoreHorizontal, Trash } from 'lucide-react'
import { AssignDocModal } from '../assign-doc-modal'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import TrackingModal from '../tracking-modal'
import { Route } from '@/routes/__root'
import { DialogConfirmation } from '../dialog-confirmation'
import useArchiveDocument from '@/hooks/use-archive-document'
import useDeleteDocument from '@/hooks/use-delete-document'
import { useUserContext } from '@/context/user-context'
import { DocumentStatusMap } from '@/lib/document-status-map'

type Props = {
  row: Row<Document>
}

const DocumentActions = ({ row }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const { authentication } = Route.useRouteContext()
  const userRole = authentication.userRole()
  const documentId = row.original.id.toString()
  const { user } = useUserContext()

  // Mutations
  const archiveDocument = useArchiveDocument()
  const deleteDocument = useDeleteDocument()

  const handleArchiveDocument = async () => {
    await archiveDocument.mutateAsync(documentId)
    setShowArchiveModal(false)
  }

  const handleDeleteDocument = async () => {
    await deleteDocument.mutateAsync(documentId)
    setShowDeleteModal(false)
  }

  const completedStatuses = [
    DocumentStatusMap.DOC_COMPLETED,
    DocumentStatusMap.DOC_ARCHIVED,
    DocumentStatusMap.DOC_REJECTED,
  ]

  const deleteStatuses = [
    DocumentStatusMap.DOC_PENDING,
    DocumentStatusMap.DOC_DRAFT_PENDING,
    DocumentStatusMap.DOC_ARCHIVED,
  ]

  const isAdminOrRecords = userRole === 'admin' || userRole === 'records'

  const canDeleteDocument =
    (isAdminOrRecords || row.original.uploaded_by === user?.id) &&
    deleteStatuses.includes(row.original.status_id!)

  const isDraft =
    row.original.status_id === DocumentStatusMap.DOC_DRAFT_PENDING ||
    row.original.status_id === DocumentStatusMap.DOC_DRAFT_IN_REVIEW

  const isDocumentCompleted = completedStatuses.includes(
    row.original.status_id!,
  )
  const canArchiveDocument =
    isAdminOrRecords &&
    isDocumentCompleted &&
    row.original.status_id !== DocumentStatusMap.DOC_ARCHIVED

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View actions */}
          <DropdownMenuItem asChild>
            <Link
              to="/documents/$documentId"
              params={{ documentId: row.original.id.toString() }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Process Document
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/*  if not a draft just render */}
          {!isDraft && !isDocumentCompleted && (
            <AssignDocModal
              trigger={
                <DropdownMenuItem
                  onSelect={(e: Event) => {
                    e.preventDefault()
                    setShowTrackingModal(!showTrackingModal)
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Assign for action
                </DropdownMenuItem>
              }
              documentTitle={row.original.title}
              documentId={row.original.id}
            />
          )}

          {/* Workflow actions */}
          {isDraft && !isAdminOrRecords && !isDocumentCompleted && (
            <AssignDocModal
              trigger={
                <DropdownMenuItem
                  onSelect={(e: Event) => {
                    e.preventDefault()
                    setShowTrackingModal(!showTrackingModal)
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Assign for action
                </DropdownMenuItem>
              }
              documentTitle={row.original.title}
              documentId={row.original.id}
            />
          )}

          <DropdownMenuItem onClick={() => setShowModal(true)}>
            <Clock className="mr-2 h-4 w-4" />
            View routing history
          </DropdownMenuItem>

          {/* Records actions */}
          {canArchiveDocument && (
            <>
              <DropdownMenuSeparator />

              {/* Final / record or admin actions */}
              <DialogConfirmation
                open={showArchiveModal}
                onOpenChange={setShowArchiveModal}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setShowArchiveModal(true)
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive document
                  </DropdownMenuItem>
                }
                title="Archive Document"
                description="Are you sure you want to archive this document?"
                submitFn={handleArchiveDocument}
                loading={archiveDocument.isPending}
              />
            </>
          )}
          {canDeleteDocument && (
            <>
              <DropdownMenuSeparator />

              <DialogConfirmation
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setShowDeleteModal(true)
                    }}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4 text-destructive" />
                    Delete
                  </DropdownMenuItem>
                }
                title="Delete Document"
                description="Are you sure you want to delete this document?"
                submitFn={handleDeleteDocument}
                loading={deleteDocument.isPending}
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
      <TrackingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        documentId={row.original.id.toString()}
      />
    </>
  )
}

export default DocumentActions
