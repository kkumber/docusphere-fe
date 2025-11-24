import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-start gap-1 text-center">
          <h1 className="text-2xl font-bold ">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email" className="">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="employee@example.com"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="">
              Password
            </FieldLabel>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button
            type="submit"
            className="bg-primary-blue hover:bg-primary-blue/80"
          >
            Login
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
