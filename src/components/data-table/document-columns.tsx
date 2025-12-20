import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import UserActions from './user-actions'
import type { Document } from '@/types/document'

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
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'originating_office',
    header: 'Originating Office',
  },
  {
    accessorKey: 'request_type',
    header: 'Request Type',
  },
  {
    accessorKey: 'status_id',
    header: 'Status',
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
  },
  //   {
  //     id: 'actions',
  //     cell: ({ row }) => {
  //       return <UserActions row={row} />
  //     },
  //   },
]
