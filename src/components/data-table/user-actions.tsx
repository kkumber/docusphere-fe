import type { User } from '@/types/user'
import type { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, UserCog, UserX, UserCheck } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'
import useActivateUser from '@/hooks/use-activate-user'
import { DialogConfirmation } from '../dialog-confirmation'
import { useState } from 'react'
import useDeactivateUser from '@/hooks/use-deactivate-user'
import ErrorDialog from '../error-dialog'

type Props = {
  row: Row<User>
}

const UserActions = ({ row }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)

  const user = row.original
  const activate = useActivateUser()
  const deactivate = useDeactivateUser()

  const handleActivateUser = () => {
    activate.mutate(user)
  }

  const handleDropdownSelect = (e: Event) => {
    e.preventDefault()
    setDropdownOpen(!dropdownOpen)
  }

  const handleDeactivateUser = () => {
    deactivate.mutate(user)
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <>
      {row!.original!.role === 'admin' ? (
        <span className="sr-only">Admin</span>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                to="/admin/users/$userId/update"
                params={{ userId: user!.id }}
                className="flex items-center"
              >
                <UserCog className="mr-2 h-4 w-4" />
                Update user details
              </Link>
            </DropdownMenuItem>

            {user!.status === 1 ? (
              <DialogConfirmation
                trigger={
                  <DropdownMenuItem onSelect={handleDropdownSelect}>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate user
                  </DropdownMenuItem>
                }
                title="Deactivate User"
                description="Are you sure you want to deactivate this user?"
                submitFn={handleDeactivateUser}
              />
            ) : (
              <DropdownMenuItem onClick={handleActivateUser}>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate user
              </DropdownMenuItem>
            )}

            {activate.isError && (
              <ErrorDialog
                title="Error"
                description={activate.error?.response?.data.message}
                open={errorDialogOpen}
                onOpenChange={setErrorDialogOpen}
              />
            )}

            {deactivate.isError && (
              <ErrorDialog
                title="Error"
                description={deactivate.error?.response?.data.message}
                open={errorDialogOpen}
                onOpenChange={setErrorDialogOpen}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

export default UserActions
