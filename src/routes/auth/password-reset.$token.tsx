// New Password Page
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { NewPasswordForm } from '@/components/new-password-form'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import type { ApiError } from '@/types/response'

export const Route = createFileRoute('/auth/password-reset/$token')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: search.email as string,
    }
  },
  beforeLoad: ({ search }) => {
    if (!search.email) {
      throw redirect({ to: '/auth/forgot-password' })
    }
  },
  component: NewPasswordPage,
})

function NewPasswordPage() {
  const [password, setPassword] = useState<string>()
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const { email } = Route.useSearch()
  const { token } = Route.useParams()

  const mutation = useMutation<{ message: string }, AxiosError<ApiError>, void>(
    {
      mutationFn: async () => {
        await api.get('/sanctum/csrf-cookie')

        const { data } = await api.post('/reset-password', {
          token: token,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        })
        return data
      },
      onSuccess: (data) => {
        setSuccessMessage(
          data.message || 'Password has been reset successfully.',
        )
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate({ to: '/auth/login' })
        }, 2000)
      },
    },
  )

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value)
    setSuccessMessage(null)
  }

  const handlePasswordConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirmation(event.currentTarget.value)
    setSuccessMessage(null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

  const errorMessage = mutation.isError
    ? mutation.error.response?.data.message
    : null

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <img src="/docusphere-icon.png" alt="docusphere icon" />
            </div>
            Docusphere
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <NewPasswordForm
              handlePasswordChange={handlePasswordChange}
              handlePasswordConfirmationChange={
                handlePasswordConfirmationChange
              }
              handleSubmit={handleSubmit}
              isPending={mutation.isPending}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />
          </div>
        </div>
      </div>
      <div className="bg-[url('/login-bg.png')] bg-cover relative hidden lg:block space-y-40 text-white">
        <div className="w-full flex items-center justify-center">
          <img src="/DepEd.png" alt="DepEd Icon" className="w-1/4" />
        </div>

        <div className="flex items-center justify-center">
          <h1 className="text-6xl text-center">Document Tracking System</h1>
        </div>

        <div className="mx-auto flex items-center justify-center rounded-full bg-white/20 px-8 py-2 max-w-max">
          <p>DepEd Makati Division</p>
        </div>
      </div>
    </div>
  )
}
