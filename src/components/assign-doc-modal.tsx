import React, { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface AssignDocModalProps {
  trigger: React.ReactNode
  documentType: string
}

export const AssignDocModal: React.FC<AssignDocModalProps> = ({
  trigger,
  documentType,
}) => {
  // CALL USE QUERY HERE TO GET ALL USERS PREFETCHED IN THE DOC MANAGEMENT MUST HAVE SAME KEY
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [instructions, setInstructions] = useState('')

  const handleAssign = () => {
    if (!selectedUser) return
    onAssign({ assignedToId: selectedUser, role: selectedRole, instructions })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Assign {documentType}</AlertDialogTitle>
          <AlertDialogDescription>
            Select a user and role to assign this document for action.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Role Selection */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">Role</label>
          <Select
            value={selectedRole}
            onValueChange={(val) => {
              setSelectedRole(val as keyof typeof usersByRole)
              setSelectedUser(null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(usersByRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Selection */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">User</label>
          <Select
            value={selectedUser?.toString() || ''}
            onValueChange={(val) => setSelectedUser(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${selectedRole} user`} />
            </SelectTrigger>
            <SelectContent>
              {usersByRole[selectedRole].map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Instructions */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">Instructions</label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Optional instructions for the assignee"
          />
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAssign}>Assign</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
