import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import api from '@/lib/api'
import { useUserContext } from '@/context/user-context'

export const Route = createFileRoute('/_authenticated/_layout')({
  beforeLoad: async ({ location, context }) => {
    const { authentication } = context

    if (!authentication.isAuthenticated()) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: LayoutComponent,
})

function LayoutComponent() {
  const { authentication } = Route.useRouteContext()
  const navigate = useNavigate()
  const { user, setUser } = useUserContext()

  if (!user) {
    api
      .get('/api/user')
      .then((res) => {
        authentication.signIn(res.data.data)
        setUser(res.data.data)
      })
      .catch((error) => {
        if (error.response) {
          authentication.signOut()
          navigate({ to: '/auth/login' })
        }
      })
  }

  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '300px',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
