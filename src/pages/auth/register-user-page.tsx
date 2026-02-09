import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { SignupForm } from '@/components/signup-form'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Upload } from 'lucide-react'

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
        <div className="space-y-4">
          {/* Bulk Upload Link */}
          <div className="max-w-3xl mx-auto">
            <Link to="/admin/bulk-register">
              <Button variant="outline" className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Upload Multiple Users (CSV)
              </Button>
            </Link>
          </div>

          <SignupForm />
        </div>
      </MainContainer>
    </>
  )
}

export default RegisterUserPage
