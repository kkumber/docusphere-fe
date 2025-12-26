import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import DocumentRegistrationForm from '@/components/document-register-form'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'Document Management',
    href: '/records/document-management',
  },
  {
    title: 'Upload Document',
    href: '#',
  },
]

const UploadDocumentPage = () => {
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <MainContainer>
        <DocumentRegistrationForm />
      </MainContainer>
    </>
  )
}

export default UploadDocumentPage
