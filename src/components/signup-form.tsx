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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Register User</CardTitle>
        <CardDescription>
          Fill out the required fields to create a new account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="first_name">First Name</FieldLabel>
              <Input id="first_name" type="text" placeholder="Juan" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
              <Input
                id="last_name"
                type="text"
                placeholder="Dela Cruz"
                required
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
            />
          </Field>

          {/* Role Dropdown */}
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <FieldDescription>
              Limit access to the system by assigning a role
            </FieldDescription>

            <Select required>
              <SelectTrigger id="role">
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
            />
          </Field>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2">
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
