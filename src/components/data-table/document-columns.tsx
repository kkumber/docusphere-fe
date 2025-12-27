import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import type { Document } from '@/types/document'
import type { DocumentStatusMap } from '@/types/ui'
import DocumentActions from './document-actions'

const statusMap: DocumentStatusMap = {
  1: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  2: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  3: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  4: {
    label: 'Delayed',
    color: 'bg-red-100 text-red-800 border-red-300',
  },
  5: {
    label: 'Released',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
}

export const documentColumns: ColumnDef<Document>[] = [
  {
    accessorKey: 'tracking_no',
    header: 'Tracking Number',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: 'instructions',
    header: 'Instructions',
  },
  {
    accessorKey: 'originating_office',
    header: 'Originating Office',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      return (
        <span className="inline-flex items-center rounded-md border px-2 py-0.5 font-medium capitalize">
          {row.original.category}
        </span>
      )
    },
  },
  {
    accessorKey: 'request_type',
    header: 'Request Type',
  },
  {
    id: 'status',
    accessorKey: 'status_id',
    header: 'Status',
    cell: ({ row }) => {
      const statusId: number = row?.original?.status_id!
      return (
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusMap[statusId!].color}`}
        >
          {statusMap[statusId!].label}
        </span>
      )
    },
    filterFn: (row, id, value: string[]) => {
      if (value.length === 0) return true
      return value.includes(String(row.getValue(id)))
    },
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DocumentActions row={row} />
    },
  },
]
