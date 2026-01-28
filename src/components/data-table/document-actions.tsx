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
import api from '@/lib/api'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { set } from 'date-fns'

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
  const queryClient = useQueryClient()

  const handleArchiveDocument = () => {
    api
      .patch(`/api/record/documents/${row.original.id}/archive`)
      .then(() => {
        toast.success('Document is now in archives')
        queryClient.invalidateQueries({
          queryKey: ['documents', userRole],
          exact: true,
          refetchType: 'active',
        })
      })
      .catch((error) => toast.error(error.response?.data.message))
  }

  const handleDeleteDocument = () => {
    api
      .delete(`/api/record/documents/${row.original.id}`)
      .then(() => {
        toast.success('Document deleted successfully')
        queryClient.invalidateQueries({
          queryKey: ['documents', userRole],
          exact: true,
          refetchType: 'active',
        })
        setShowDeleteModal(false)
      })
      .catch((error) => toast.error(error.response?.data.message))
  }

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

          {/* Workflow actions */}
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

          <DropdownMenuItem onClick={() => setShowModal(true)}>
            <Clock className="mr-2 h-4 w-4" />
            View routing history
          </DropdownMenuItem>

          {/* Records actions */}
          {userRole === 'records' ||
            (userRole === 'admin' && (
              <>
                <DropdownMenuSeparator />

                {/* Final / record or admin actions */}
                <DialogConfirmation
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
                />

                <DialogConfirmation
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setShowDeleteModal(true)
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  }
                  title="Delete Document"
                  description="Are you sure you want to delete this document?"
                  submitFn={handleDeleteDocument}
                />
              </>
            ))}
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
