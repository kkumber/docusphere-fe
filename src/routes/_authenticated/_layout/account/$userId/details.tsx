import { createFileRoute } from '@tanstack/react-router'
import AccountDetails from '@/pages/account/account-details'

export const Route = createFileRoute(
  '/_authenticated/_layout/account/$userId/details',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountDetails />
}
