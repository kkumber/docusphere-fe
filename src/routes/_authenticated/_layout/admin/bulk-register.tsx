import { BulkUploadForm } from '@/components/bulk-register-form'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_layout/admin/bulk-register',
)({
  component: BulkRegisterComponent,
})

function BulkRegisterComponent() {
  const breadcrumbs: Breadcrumbs[] = [
    {
      title: 'User Management',
      href: '/admin/user-management',
    },
    {
      title: 'User Registration',
      href: '/admin/register-user',
    },
    {
      title: 'Bulk Upload',
      href: '/admin/bulk-upload',
    },
  ]
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        <BulkUploadForm />
      </MainContainer>
    </>
  )
}
