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
import {
  UserCog,
  User as UserIcon,
  Mail,
  Building2,
  ShieldCheck,
} from 'lucide-react'

type UpdateUserFormProps = {
  user: User
  props?: React.ComponentProps<typeof Card>
}

export function UpdateUserForm({ user, ...props }: UpdateUserFormProps) {
  const [userData, setUserData] = useState<User>(user)
  const mutation = useUpdateUser()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return
    setUserData({ ...userData, [event.target.id]: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
        <Card
          {...props}
          className="max-w-3xl mx-auto border border-muted shadow-sm"
        >
          {/* Header */}
          <CardHeader className="space-y-2 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCog className="h-5 w-5 text-primary-blue" />
              Update User
            </CardTitle>
            <CardDescription className="max-w-xl">
              Change only the fields you want to update.
            </CardDescription>

            {mutation.error && (
              <p className="text-sm text-destructive">
                {mutation.error.response?.data.message}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <UserIcon className="h-4 w-4 text-primary-blue" />
                  Personal Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                    <Input
                      id="first_name"
                      type="text"
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
                      required
                      value={userData!.last_name}
                      onChange={handleChange}
                    />
                  </Field>
                </div>
              </section>

              {/* Office */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary-blue" />
                  Office Assignment
                </div>

                <Field>
                  <FieldLabel htmlFor="office">Office</FieldLabel>
                  <Input
                    id="office"
                    type="text"
                    required
                    value={userData!.office}
                    onChange={handleChange}
                  />
                </Field>
              </section>

              {/* Role */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary-blue" />
                  Access Control
                </div>

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
              </section>

              {/* Email */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary-blue" />
                  Account Email
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={userData!.email}
                    onChange={handleChange}
                  />
                </Field>
              </section>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
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
