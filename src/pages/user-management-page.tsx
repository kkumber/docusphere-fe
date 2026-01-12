import { DataTable } from '@/components/data-table/data-table'
import useGetRequest from '@/hooks/use-get'
import { userColumns } from '@/components/data-table/user-columns'
import { DataTableSkeleton } from '@/components/data-table/skeleton-table'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type {
  ColumnValuesForFilterStatus,
  FilterSearchInput,
  Breadcrumbs,
} from '@/types/ui'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { User } from '@/types/user'
import type { Response } from '@/types/response'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'User Management',
    href: '/admin/user-management',
  },
]

const UserManagementPage = () => {
  const { isPending, data, isError, error } = useGetRequest<Response<User[]>>({
    url: '/api/users',
    key: ['users'],
  })

  const columnValuesForFilter: ColumnValuesForFilterStatus[] = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ]

  const searchFilterInputValues: FilterSearchInput = {
    placeholder: 'Search by last name',
    column: 'last_name',
  }

  const btnActions = () => {
    return (
      <Button size="sm" asChild>
        <Link to="/admin/register-user">
          <UserPlus />
          Add User
        </Link>
      </Button>
    )
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {isPending && <DataTableSkeleton columnCount={6} />}
        {isError && <p>{error?.message}</p>}
        {data && (
          <DataTable
            columns={userColumns}
            data={data.data}
            columnValuesForFilter={columnValuesForFilter}
            searchFilterInput={searchFilterInputValues}
            btnActions={btnActions()}
          />
        )}
      </MainContainer>
    </>
  )
}

export default UserManagementPage
