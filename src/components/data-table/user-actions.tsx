import type { User } from '@/types/user'
import type { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'
import useActivateUser from '@/hooks/use-activate-user'

type Props = {
  row: Row<User>
}

const UserActions = ({ row }: Props) => {
  const user = row.original
  const activate = useActivateUser()

  const handleActivateUser = () => {
    activate.mutate(user)
  }

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
          <Link to="/admin/users/$userId/update" params={{ userId: user!.id }}>
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
}

export default UserActions
