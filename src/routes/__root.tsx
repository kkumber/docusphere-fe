import {
  Outlet,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth, type AuthContext } from '@/hooks/use-auth'
import { useState } from 'react'
import type { User } from '@/types/user'
import { UserContext } from '@/context/user-context'

const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<AuthContext>()({
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
