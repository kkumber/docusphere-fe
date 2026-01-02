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
import {
  Eye,
  CheckCircle,
  Send,
  Archive,
  Clock,
  XCircle,
  MoreHorizontal,
} from 'lucide-react'
import { AssignDocModal } from '../assign-doc-modal'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
type Props = {
  row: Row<Document>
}

const DocumentActions = ({ row }: Props) => {
  const [showAssignModal, setShowAssignModal] = useState(false)

  return (
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
            View document
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Workflow actions */}
        <AssignDocModal
          trigger={
            <DropdownMenuItem
              onSelect={(e: Event) => {
                e.preventDefault()
                setShowAssignModal(!showAssignModal)
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Assign for action
            </DropdownMenuItem>
          }
          documentTitle={row.original.title}
          documentId={row.original.id}
        />

        <DropdownMenuItem>
          <Clock className="mr-2 h-4 w-4" />
          View routing history
        </DropdownMenuItem>

        <DropdownMenuItem>
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve / Authorize
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Final / admin actions */}
        <DropdownMenuItem>
          <Archive className="mr-2 h-4 w-4" />
          Archive document
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600 focus:text-red-600">
          <XCircle className="mr-2 h-4 w-4" />
          Reject document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DocumentActions
