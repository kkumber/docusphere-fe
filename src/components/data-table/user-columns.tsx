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

// handler functions for actions
const handleDeactivateUser = (user: User) => {}

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
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                to="/admin/users/$userId/update"
                params={{ userId: user!.id }}
              >
                Update User
              </Link>
            </DropdownMenuItem>
            {user!.status === 1 ? (
              <DropdownMenuItem>Deactivate User</DropdownMenuItem>
            ) : (
              <DropdownMenuItem>Activate User</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
