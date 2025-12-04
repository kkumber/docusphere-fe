import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import type { Breadcrumbs } from '@/types/ui'

export const Route = createFileRoute('/_authenticated/')({
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
      hello dashboard Page
    </>
  )
}
