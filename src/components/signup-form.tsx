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
import useRegisterUser from '@/hooks/use-register-user'
import type { UserRegister } from '@/types/user'
import { useState } from 'react'
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Building2,
  ShieldCheck,
} from 'lucide-react'

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const mutation = useRegisterUser()
  const [userInfo, setUserInfo] = useState<UserRegister>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
    office: '',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate(userInfo)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [event.target.id]: event.target.value })
  }

  return (
    <Card
      {...props}
      className="max-w-3xl mx-auto border border-muted shadow-sm"
    >
      {/* Header */}
      <CardHeader className="space-y-2 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="h-5 w-5 text-primary-blue" />
          Register User
        </CardTitle>
        <CardDescription className="max-w-xl">
          Create a new system account and assign the appropriate access level.
        </CardDescription>

        {mutation.error && (
          <p className="text-sm text-destructive">
            {mutation.error.response?.data.message}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <form className="space-y-8" id="registerForm" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <User className="h-4 w-4 text-primary-blue" />
              Personal Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Juan"
                  required
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
                  onChange={handleChange}
                />
              </Field>
            </div>
          </section>

          {/* Office */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary-blue" />
              Office Assignment
            </div>

            <Field>
              <FieldLabel htmlFor="office">Office</FieldLabel>
              <Input
                id="office"
                type="text"
                placeholder="Division Office / HR / Accounting"
                required
                onChange={handleChange}
              />
            </Field>
          </section>

          {/* Role */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary-blue" />
              Access Control
            </div>

            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <FieldDescription>
                Determines the user's permissions within the system.
              </FieldDescription>

              <Select
                required
                onValueChange={(value) =>
                  setUserInfo({ ...userInfo, role: value })
                }
                value={userInfo.role}
              >
                <SelectTrigger id="role" name="role">
                  <SelectValue placeholder="Assign a role" />
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

          {/* Credentials */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Mail className="h-4 w-4 text-primary-blue" />
              Login Credentials
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@deped.gov.ph"
                required
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Temporary Password</FieldLabel>
              <FieldDescription>
                This will be used during the user's first login.
              </FieldDescription>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
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
            {mutation.isPending ? 'Registering...' : 'Register User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
