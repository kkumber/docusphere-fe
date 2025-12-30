import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import useGetRequest from '@/hooks/use-get'
import type { User } from '@/types/user'
import { Spinner } from './ui/spinner'

interface UsersByRole {
  [role: string]: User[]
}

interface AssignDocModalProps {
  trigger: React.ReactNode
  documentTitle: string
}

interface UserDataResponse {
  data: UsersByRole
}

export const AssignDocModal: React.FC<AssignDocModalProps> = ({
  trigger,
  documentTitle,
}) => {
  /**
   * We assume the API returns users grouped by role, e.g.
   * {
   *   sds: [{ id, frst_name, last_name, office }],
   *   chief: [...],
   *   staff: [...]
   * }
   */
  const { isPending, data, isError, error } = useGetRequest<UserDataResponse>({
    key: ['usersByRole'],
    url: '/api/users/roles',
  })

  /**
   * UX decision:
   * - Roles are multi‑select (checkboxes)
   * - Users are multi‑select but grouped visually by role
   */
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [instructions, setInstructions] = useState('')
  const [users, setUsers] = useState<UsersByRole>(data!.data)

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )

    // Remove users belonging to an unselected role
    if (selectedRoles.includes(role)) {
      const roleUserIds = users[role]?.map((u: User) => u?.id) ?? []
      setSelectedUsers((prev) => prev.filter((id) => !roleUserIds.includes(id)))
    }
  }

  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  const visibleUsersByRole = useMemo(() => {
    return Object.fromEntries(
      Object.entries(users).filter(([role]) => selectedRoles.includes(role)),
    )
  }, [users, selectedRoles])

  const handleAssign = () => {
    // submit selectedRoles, selectedUsers, instructions
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        {isPending && (
          <Spinner className="text-primary-blue size-8 flex items-center justify-center" />
        )}
        {isError && (
          <p className="text-destructive">
            Error fetching users: {error?.message}
          </p>
        )}
        <AlertDialogHeader>
          <AlertDialogTitle>Assign {documentTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            Select one or more roles, then choose the users under each role.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Role Selection */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="mt-4">
            <p className="mb-2 font-medium">Roles</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(users).map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 rounded-md border p-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* User Selection (Grouped) */}
          {selectedRoles.length > 0 && users && (
            <div className="mt-6 space-y-4">
              <p className="font-medium">Users</p>

              {Object.entries(visibleUsersByRole).map(([role, users]) => (
                <div key={role} className="rounded-md border p-3">
                  <p className="mb-2 text-sm font-semibold capitalize text-muted-foreground">
                    {role}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {users.map((user: User) => (
                      <label
                        key={user!.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user!.id)}
                          onCheckedChange={() => toggleUser(user!.id)}
                        />
                        <span>
                          {user!.first_name +
                            ' ' +
                            user!.last_name +
                            ' ' +
                            `(${user!.office})`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6">
            <label className="block mb-1 font-medium">Instructions</label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Optional instructions for the assignees"
            />
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={selectedUsers.length === 0}
            onClick={handleAssign}
          >
            Assign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
