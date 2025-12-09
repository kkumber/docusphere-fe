import { DataTable } from '@/components/data-table/data-table'
import useGetRequest from '@/hooks/use-get'
import { userColumns } from '@/components/data-table/columns'
import SkeletonTableBasic from '@/components/skeleton-table'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'User Management',
    href: '/user-management',
  },
]

const UserManagementPage = () => {
  const { isPending, data, isError, error } = useGetRequest({
    url: '/api/users',
    key: ['users'],
  })

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {isPending && <SkeletonTableBasic />}
        {isError && <p>{error?.message}</p>}
        {data && <DataTable columns={userColumns} data={data.data} />}
      </MainContainer>
    </>
  )
}

export default UserManagementPage
