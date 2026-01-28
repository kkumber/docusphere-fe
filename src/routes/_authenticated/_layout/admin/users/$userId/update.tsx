import { createFileRoute, notFound } from '@tanstack/react-router'
import UpdateUserPage from '@/pages/auth/update-user-page'
import api from '@/lib/api'

export const Route = createFileRoute(
  '/_authenticated/_layout/admin/users/$userId/update',
)({
  beforeLoad: ({ context }) => {
    if (context.authentication.userRole() !== 'admin') {
      throw notFound()
    }
  },
  component: UserUpdateRoute,
  loader: async ({
    params,
  }: {
    params: { userId: string | number | null }
  }) => {
    const { data } = await api.get(`/api/users/${params.userId}`)
    return data.data
  },
})

function UserUpdateRoute() {
  const user = Route.useLoaderData()
  return <UpdateUserPage user={user} />
}
