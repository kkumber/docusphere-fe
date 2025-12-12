import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { SignupForm } from '@/components/signup-form'

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
        <SignupForm />
      </MainContainer>
    </>
  )
}

export default RegisterUserPage
