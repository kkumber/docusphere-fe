// Forgot Password Page
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import type { ApiError } from '@/types/response'

export const Route = createFileRoute('/auth/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.authentication.isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const mutation = useMutation<{ message: string }, AxiosError<ApiError>, void>(
    {
      mutationFn: async () => {
        await api.get('/sanctum/csrf-cookie')

        const { data } = await api.post('/forgot-password', {
          email: email,
        })
        return data
      },
      onSuccess: (data) => {
        setSuccessMessage(
          data.message ||
            'Password reset link has been sent to your email address.',
        )
      },
      onError: (error) => {
        console.error('Password reset failed', error.response?.data.message)
        setSuccessMessage(null)
      },
    },
  )

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value)
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
            <ForgotPasswordForm
              handleEmailChange={handleEmailChange}
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
          <img src="/docusphere-icon.png" alt="Docusphere Icon" className="w-1/4" />
        </div>

        <div className="flex items-center justify-center">
          <h1 className="text-6xl text-center">Document Tracking System</h1>
        </div>

        <div className="mx-auto flex items-center justify-center rounded-full bg-white/20 px-8 py-2 max-w-max">
          <p>DocuSphere Management</p>
        </div>
      </div>
    </div>
  )
}
