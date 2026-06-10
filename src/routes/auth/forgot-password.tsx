// Forgot Password Page
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { AxiosError } from 'axios'
import type { ApiError } from '@/types/response'
import { Button } from '@/components/ui/button'

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
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-[url('/login-bg.png')] bg-cover bg-center z-0"
          style={{ filter: 'brightness(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-blue/20 to-black/60 z-1" />

        <div className="relative z-10 flex flex-col items-center max-w-lg text-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/docusphere-icon.png"
              alt="Docusphere Icon"
              className="w-24 drop-shadow-2xl"
            />
            <div className="space-y-2">
              <h1 className="text-5xl font-extrabold tracking-tight">DocuSphere</h1>
              <p className="text-xl text-white/80 font-medium">Document Tracking & Monitoring</p>
            </div>
          </div>

          <div className="w-full h-px bg-white/20" />

          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="w-full rounded-xl bg-white/10 border border-white/20 px-6 py-2 backdrop-blur-md hover:bg-white/20 transition-all group">
              <Button variant="link" className="text-white w-full h-auto p-0 hover:no-underline" asChild>
                <a
                  href="https://drive.google.com/file/d/1n5XNxZpGIcJKOSDS7FfqZBnVdsJE6mGC/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-sm font-semibold tracking-wide uppercase">How Docusphere Works</span>
                </a>
              </Button>
            </div>

            <div className="flex w-full gap-3">
              <div className="flex-1 rounded-xl bg-white/10 border border-white/20 py-2 backdrop-blur-md hover:bg-white/20 transition-all">
                <Button variant="link" className="text-white w-full h-auto p-0 hover:no-underline text-xs font-medium uppercase tracking-wider" asChild>
                  <a
                    href="https://github.com/kkumber/docusphere-fe"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </a>
                </Button>
              </div>
              <div className="flex-1 rounded-xl bg-white/10 border border-white/20 py-2 backdrop-blur-md hover:bg-white/20 transition-all">
                <Button variant="link" className="text-white w-full h-auto p-0 hover:no-underline text-xs font-medium uppercase tracking-wider" asChild>
                  <a
                    href="https://kkumber.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
