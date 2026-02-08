import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type NewPasswordFormProps = {
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordConfirmationChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isPending: boolean
  errorMessage: string | null | undefined
  successMessage: string | null
}

type Props = React.ComponentProps<'form'> & NewPasswordFormProps

export function NewPasswordForm({
  className,
  handlePasswordChange,
  handlePasswordConfirmationChange,
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
        <div className="flex flex-col items-start gap-1 text-center md:text-start">
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below
          </p>
        </div>
        {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-600 bg-green-50 p-3 rounded-md">
            {successMessage}
          </p>
        )}
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            onChange={handlePasswordChange}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password_confirmation">
            Confirm Password
          </FieldLabel>
          <Input
            id="password_confirmation"
            type="password"
            placeholder="Confirm new password"
            onChange={handlePasswordConfirmationChange}
            required
          />
        </Field>
        <Field>
          <Button
            type="submit"
            className="bg-primary-blue hover:bg-primary-blue/80"
            disabled={isPending}
          >
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
