import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContext } from '@/context/user-context'
import { useState } from 'react'
import type { User } from '@/types/user'

const queryClient = new QueryClient()

interface useAuthContext {
  isAuthenticated: () => boolean
  signIn: () => void
  signOut: () => void
}

interface AuthenticationContext {
  authentication: useAuthContext
}

export const Route = createRootRouteWithContext<AuthenticationContext>()({
  component: App,
})

function App() {
  const [user, setUser] = useState<User | null>(null)
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext value={{ user, setUser }}>
          <Outlet />
        </UserContext>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
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
