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
import { ArrowUpDown } from 'lucide-react'

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center justify-start text-left hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center justify-start text-left hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 py-2"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: 'office',
    header: 'Office',
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original?.status}</div>
    ),
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
            <DropdownMenuItem>Update User</DropdownMenuItem>
            <DropdownMenuItem>Delete User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
