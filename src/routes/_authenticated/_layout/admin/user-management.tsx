import { createFileRoute } from '@tanstack/react-router'
import UserManagementPage from '@/pages/user-management'

export const Route = createFileRoute(
  '/_authenticated/_layout/admin/user-management',
)({
  component: UserManagementRoute,
})

function UserManagementRoute() {
  return <UserManagementPage />
}
