import { createFileRoute } from '@tanstack/react-router'
import { useUserContext } from '@/context/user-context'

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/"!</div>
}
