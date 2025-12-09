import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@/types/user'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'office',
    header: 'Office',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]
