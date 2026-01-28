import { createFileRoute, notFound } from '@tanstack/react-router'
import UserManagementPage from '@/pages/user-management-page'

export const Route = createFileRoute(
  '/_authenticated/_layout/admin/user-management',
)({
  beforeLoad: ({ context }) => {
    if (context.authentication.userRole() !== 'admin') {
      throw notFound()
    }
  },
  component: UserManagementRoute,
})

function UserManagementRoute() {
  return <UserManagementPage />
}
