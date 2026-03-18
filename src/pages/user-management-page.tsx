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
import { UserPlus, Users } from 'lucide-react'
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
        <div className="">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-blue/10 p-2">
                <Users className="h-5 w-5 text-primary-blue" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Users List
                </h2>
                <p className="text-sm text-gray-500">
                  Browse, filter, and manage users within the system.
                </p>
              </div>
            </div>
          </div>

          <div className="">
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
          </div>
        </div>
      </MainContainer>
    </>
  )
}

export default UserManagementPage
