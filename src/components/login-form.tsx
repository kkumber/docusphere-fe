import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'

type LoginFormProps = {
  email?: string
  password?: string
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isPending: boolean
  errorMessage: string | null | undefined
}

type Props = React.ComponentProps<'form'> & LoginFormProps

export function LoginForm({
  className,
  email,
  password,
  handleEmailChange,
  handlePasswordChange,
  handleSubmit,
  isPending,
  errorMessage,
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
          <p className="text-muted-foreground text-sm text-left">
            Enter your email below to login to your account
          </p>
        </div>
        {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        <Field>
          <FieldLabel htmlFor="email" className="">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="employee@example.com"
            value={email || ''}
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
            value={password || ''}
            onChange={handlePasswordChange}
            required
          />
        </Field>
        <Link
          to="/auth/forgot-password"
          className="flex items-center justify-end"
        >
          <Button type="button" variant={'link'} className="p-0 m-0 ">
            Forgot Password
          </Button>
        </Link>
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
