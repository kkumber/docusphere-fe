import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'User Management',
    href: '/admin/user-management',
  },
  {
    title: 'Register User',
    href: '/admin/register-user',
  },
]

const RegisterUserPage = () => {
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        <h1>Register User</h1>
      </MainContainer>
    </>
  )
}

export default RegisterUserPage
