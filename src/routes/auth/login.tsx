import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '@/components/login-form'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      return response.json()
    },
  })

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

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
            <LoginForm
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
            />
          </div>
        </div>
      </div>
      <div className="bg-[url('/login-bg.png')] bg-cover relative hidden lg:block space-y-40 text-white">
        <div className="w-full flex items-center justify-center ">
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
