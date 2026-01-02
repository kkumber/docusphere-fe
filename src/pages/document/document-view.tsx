import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import useGetRequest from '@/hooks/use-get'
import type { Document } from '@/types/document'
import type { DataReseponse } from '@/types/response'
import type { Breadcrumbs } from '@/types/ui'
import type { User } from '@/types/user'
import { getRouteApi } from '@tanstack/react-router'
import { PdfViewer } from '@/components/pdf-viewer'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'Document Management',
    href: '/documents/document-management',
  },
  {
    title: 'View Document',
    href: '#',
  },
]

const route = getRouteApi('/_authenticated/_layout/documents/$documentId')

const DocumentView = () => {
  const { documentId } = route.useParams()
  const data = route.useLoaderData()

  console.log(data)

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <MainContainer>
        <PdfViewer pdfUrl={data.url} user={data.user} />
      </MainContainer>
    </>
  )
}

export default DocumentView
