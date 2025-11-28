import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

type LoginFormProps = {
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isPending: boolean
}

type Props = React.ComponentProps<'form'> & LoginFormProps

export function LoginForm({
  className,
  handleEmailChange,
  handlePasswordChange,
  handleSubmit,
  isPending,
  ...props
}: Props) {
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
    >
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
            onChange={handleEmailChange}
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="">
              Password
            </FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            onChange={handlePasswordChange}
            required
          />
        </Field>
        <Field>
          <Button
            type="submit"
            className="bg-primary-blue hover:bg-primary-blue/80"
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
