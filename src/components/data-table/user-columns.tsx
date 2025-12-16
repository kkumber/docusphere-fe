import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@/types/user'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from './data-table-column-header'
import { Link } from '@tanstack/react-router'
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
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="uppercase">{row.getValue('role')}</div>,
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
