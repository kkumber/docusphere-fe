import { createFileRoute, notFound } from '@tanstack/react-router'
import RegisterUserPage from '@/pages/auth/register-user-page'

export const Route = createFileRoute(
  '/_authenticated/_layout/admin/register-user',
)({
  beforeLoad: ({ context }) => {
    if (context.authentication.userRole() !== 'admin') {
      throw notFound()
    }
  },
  component: RegisterUserRoute,
})

function RegisterUserRoute() {
  return <RegisterUserPage />
}
