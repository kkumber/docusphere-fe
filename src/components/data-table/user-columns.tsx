import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@/types/user'
import { DataTableColumnHeader } from './data-table-column-header'
import UserActions from './user-actions'

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'office',
    header: 'Office',
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <div className="">{row.getValue('department') ?? 'None'}</div>
    ),
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
    cell: ({ row }) => (
      <div className="">{row.getValue('designation') ?? 'None'}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="uppercase">{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'email_verified_at',
    header: 'Verified',
    cell: ({ row }) => (
      <div className="uppercase">
        {row.original?.email_verified_at ? 'True' : 'False'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original?.status === 1 ? 'Active' : 'Inactive'}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.length ? value.includes(String(row.getValue(id))) : true
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <UserActions row={row} />
    },
  },
]
