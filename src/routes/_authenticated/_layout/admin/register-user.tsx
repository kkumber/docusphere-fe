import { createFileRoute } from '@tanstack/react-router'
import RegisterUserPage from '@/pages/auth/register-user-page'

export const Route = createFileRoute(
  '/_authenticated/_layout/admin/register-user',
)({
  component: RegisterUserRoute,
})

function RegisterUserRoute() {
  return <RegisterUserPage />
}
