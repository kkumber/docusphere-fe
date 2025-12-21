import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useUpdateUser from '@/hooks/use-update-user'
import type { User } from '@/types/user'
import { useState } from 'react'
import { toast } from 'sonner'

type UpdateUserFormProps = {
  user: User
  props?: React.ComponentProps<typeof Card>
}

export function UpdateUserForm({ user, ...props }: UpdateUserFormProps) {
  const [userData, setUserData] = useState<User>(user)
  const mutation = useUpdateUser()

  // handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return
    setUserData({ ...userData, [event.target.id]: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // check if userData has not change if so return if not continue to update
    event.preventDefault()
    if (
      userData!.first_name === user?.first_name &&
      userData!.last_name === user.last_name &&
      userData!.office === user.office &&
      userData!.role === user.role &&
      userData?.email === user.email
    ) {
      return toast.error('No changes detected.')
    }

    mutation.mutate(userData)
  }

  return (
    <>
      {userData && (
        <Card {...props} className="max-w-3xl mx-auto shadow-xl border-muted">
          <CardHeader>
            <CardTitle>Update User</CardTitle>
            <CardDescription>
              Change only the fields you want to update.
            </CardDescription>
            {mutation.error && (
              <p className="text-red-500">
                {mutation.error.response?.data.message}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Juan"
                    required
                    value={userData!.first_name}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Dela Cruz"
                    required
                    value={userData!.last_name}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              {/* Office */}
              <Field>
                <FieldLabel htmlFor="office">Office</FieldLabel>
                <Input
                  id="office"
                  type="text"
                  placeholder="Division Office / HR / Accounting"
                  required
                  value={userData!.office}
                  onChange={handleChange}
                />
              </Field>

              {/* Role Dropdown */}
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <FieldDescription>
                  Be cautious in assigning a new role.
                </FieldDescription>

                <Select
                  required
                  onValueChange={(value) =>
                    setUserData({ ...userData!, role: value })
                  }
                  value={userData!.role}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder={userData!.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="records">Records</SelectItem>
                    <SelectItem value="sds">
                      Schools Division Superintendent
                    </SelectItem>
                    <SelectItem value="chief">Chief</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@deped.gov.ph"
                  required
                  value={userData!.email}
                  onChange={handleChange}
                />
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Updating...' : 'Update User'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default UpdateUserForm
