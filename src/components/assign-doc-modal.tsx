import React, { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from './ui/spinner'
import useGetRequest from '@/hooks/use-get'
import type { User } from '@/types/user'
import {
  ChevronDown,
  ChevronRight,
  Users,
  User as UserIcon,
  FileText,
} from 'lucide-react'

interface UsersByRole {
  [role: string]: User[]
}

interface UserDataResponse {
  data: UsersByRole
}

interface AssignDocModalProps {
  trigger: React.ReactNode
  documentTitle: string
}

type RequestType =
  | 'for_signature'
  | 'for_approval'
  | 'for_information'
  | 'for_review'
  | 'for_response'

export const AssignDocModal: React.FC<AssignDocModalProps> = ({
  trigger,
  documentTitle,
}) => {
  const { isPending, data, isError, error } = useGetRequest<UserDataResponse>({
    key: ['usersByRole'],
    url: '/api/users/roles',
  })

  const usersByRole = data?.data ?? {}

  const [openRoles, setOpenRoles] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [instructions, setInstructions] = useState('')
  const [requestType, setRequestType] = useState<RequestType | ''>('')

  // toggle open roles used in role accordion
  const toggleRoleOpen = (role: string) => {
    setOpenRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  // select users
  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  // toggle select all users per role
  const toggleSelectAll = (role: string) => {
    const roleUserIds = usersByRole[role].map((u) => u!.id)
    const allSelected = roleUserIds.every((id) => selectedUsers.includes(id))

    setSelectedUsers((prev) =>
      allSelected
        ? prev.filter((id) => !roleUserIds.includes(id))
        : [...new Set([...prev, ...roleUserIds])],
    )
  }

  // submit function
  const handleAssign = () => {
    const payload = {
      request_type: requestType,
      users: selectedUsers,
      instructions,
    }

    console.log(payload)
    // submit payload
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        {isPending && <Spinner className="size-8 mx-auto text-primary-blue" />}

        {isError && (
          <p className="text-destructive">
            Error fetching users: {error?.message}
          </p>
        )}

        <AlertDialogHeader>
          <AlertDialogTitle>Assign {documentTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            You can assign this document to multiple users. Only one request
            type per assignment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* ---------------- Request Type ---------------- */}
        <div className="rounded-md border bg-muted/40 p-3 mt-2">
          <label className="flex items-center gap-2 mb-2 font-medium">
            <FileText className="size-4 text-muted-foreground" />
            Request Type
          </label>

          <Select
            required
            value={requestType}
            onValueChange={(value) => setRequestType(value as RequestType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="for_signature">For Signature</SelectItem>
              <SelectItem value="for_approval">For Approval</SelectItem>
              <SelectItem value="for_information">For Information</SelectItem>
              <SelectItem value="for_review">For Review</SelectItem>
              <SelectItem value="for_response">For Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ---------------- Roles & Users ---------------- */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mt-4">
          {Object.entries(usersByRole).map(([role, users]) => {
            const roleUserIds = users.map((u) => u!.id)
            const selectedCount = roleUserIds.filter((id) =>
              selectedUsers.includes(id),
            ).length

            const allSelected =
              selectedCount === roleUserIds.length && roleUserIds.length > 0

            return (
              <div key={role} className="rounded-md border bg-background">
                {/* Role Header */}
                <button
                  type="button"
                  onClick={() => toggleRoleOpen(role)}
                  className="flex w-full items-center justify-between p-3 hover:bg-muted transition"
                >
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="capitalize font-medium">{role}</span>
                    <span className="text-xs text-muted-foreground">
                      ({users.length})
                    </span>
                  </div>

                  {openRoles.includes(role) ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </button>

                {/* Users */}
                {openRoles.includes(role) && (
                  <div className="border-t p-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => toggleSelectAll(role)}
                      />
                      Select all
                    </label>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {users.map((user) => (
                        <label
                          key={user?.id}
                          className="flex items-center gap-2 cursor-pointer text-sm"
                        >
                          <Checkbox
                            checked={selectedUsers.includes(user!.id)}
                            onCheckedChange={() => toggleUser(user!.id)}
                          />
                          <UserIcon className="size-3 text-muted-foreground" />
                          <span>
                            {user?.first_name} {user?.last_name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* ---------------- Instructions ---------------- */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Instructions</label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Optional instructions for assignees"
            />
          </div>
        </div>

        {/* ---------------- Footer ---------------- */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!requestType || selectedUsers.length === 0}
            onClick={handleAssign}
          >
            Assign ({selectedUsers.length})
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
