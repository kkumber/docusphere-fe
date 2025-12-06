import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import type { Breadcrumbs } from '@/types/ui'
import MainContainer from '@/components/MainContainer'

export const Route = createFileRoute('/_authenticated/_layout/')({
  component: DashboardPage,
})

const breadcrumbList: Breadcrumbs[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
]

function DashboardPage() {
  return (
    <>
      <Header breadcrumbs={breadcrumbList} />

      <MainContainer>
        <div className="">Hello</div>
      </MainContainer>
    </>
  )
}
