import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type AuthContext } from '@/hooks/use-auth'
import { UserContext } from '@/context/user-context'
import { Toaster } from 'sonner'
import api from '@/lib/api'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<{
  authentication: AuthContext
}>()({
  component: App,
})

function App() {
  const { authentication } = Route.useRouteContext()
  const navigate = useNavigate()
  const [user, setUser] = useState(authentication.user)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={6000}
        />
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
          <Outlet />
        </UserContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </QueryClientProvider>
    </>
  )
}
