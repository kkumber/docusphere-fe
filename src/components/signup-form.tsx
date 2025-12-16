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
    <Card {...props}>
      <CardHeader>
        <CardTitle>Register User</CardTitle>
        <CardDescription>
          Fill out the required fields to create a new account.
        </CardDescription>
        {mutation.error && (
          <p className="text-red-500">
            {mutation.error.response?.data.message}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <form className="space-y-4" id="registerForm" onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Office */}
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

          {/* Role Dropdown */}
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <FieldDescription>
              Limit access to the system by assigning a role
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

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="example@deped.gov.ph"
              required
              onChange={handleChange}
            />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Temporary Password</FieldLabel>
            <FieldDescription>
              This will be the user's initial login password.
            </FieldDescription>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
            />
          </Field>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
