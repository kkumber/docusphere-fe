import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import UpdateUserForm from '@/components/update-user-form'
import type { Breadcrumbs } from '@/types/ui'
import type { User } from '@/types/user'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'User Management',
    href: '/admin/user-management',
  },
  {
    title: 'Update User',
    href: '/admin/users/$userId/update',
  },
]

type Props = {
  user: User
}

const UpdateUserPage = ({ user }: Props) => {
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        <UpdateUserForm user={user} />
      </MainContainer>
    </>
  )
}

export default UpdateUserPage
