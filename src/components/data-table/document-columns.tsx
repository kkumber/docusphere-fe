import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import type { Document } from '@/types/document'
import type { DocumentStatusMap } from '@/types/ui'
import DocumentActions from './document-actions'

const statusMap: DocumentStatusMap = {
  /**
   * =========================
   * DOCUMENT (GLOBAL STATUS)
   * =========================
   */

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
    color: 'bg-orange-100 text-orange-800 border-orange-300',
  },

  5: {
    label: 'Released',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },

  /**
   * ==============================
   * DOCUMENT ASSIGNMENT (TASK)
   * ==============================
   */

  6: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },

  7: {
    label: 'Acknowledged',
    color: 'bg-green-100 text-green-800 border-green-300',
  },

  8: {
    label: 'Approved',
    color: 'bg-blue-100 text-blue-800 border-blue-300 ',
  },

  9: {
    label: 'Signed',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },

  10: {
    label: 'Reviewed',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },

  11: {
    label: 'Responded',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  },

  12: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-300',
  },

  13: {
    label: 'Delayed',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
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
    cell: ({ row }) => (
      <div className="w-48 truncate">{row.original.instructions ?? 'None'}</div>
    ),
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
      const statusId: number | undefined = row?.original?.status_id
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
    cell: ({ row }) => (
      <div className="">{row.original.due_date ?? 'None'}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DocumentActions row={row} />
    },
  },
]
