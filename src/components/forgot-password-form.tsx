import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'

type ForgotPasswordFormProps = {
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isPending: boolean
  errorMessage: string | null | undefined
  successMessage: string | null
}

type Props = React.ComponentProps<'form'> & ForgotPasswordFormProps

export function ForgotPasswordForm({
  className,
  handleEmailChange,
  handleSubmit,
  isPending,
  errorMessage,
  successMessage,
  ...props
}: Props) {
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-start gap-1r text-center md:text-start">
          <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-left">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>
        {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-600 bg-green-50 p-3 rounded-md">
            {successMessage}
          </p>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="employee@example.com"
            onChange={handleEmailChange}
            required
          />
        </Field>
        <Field>
          <Button
            type="submit"
            className="bg-primary-blue hover:bg-primary-blue/80"
            disabled={isPending}
          >
            {isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Field>
        <Link to="/auth/login" className="flex items-center justify-center">
          <Button variant={'link'} className="p-0 m-0">
            Back to Login
          </Button>
        </Link>
      </FieldGroup>
    </form>
  )
}
