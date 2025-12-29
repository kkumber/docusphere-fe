import { DataTable } from '@/components/data-table/data-table'
import { documentColumns } from '@/components/data-table/document-columns'
import { DataTableSkeleton } from '@/components/data-table/skeleton-table'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/user-context'
import useGetRequest from '@/hooks/use-get'
import usePrefetchRequest from '@/hooks/use-prefetch-request'
import type {
  Breadcrumbs,
  ColumnValuesForFilterStatus,
  FilterSearchInput,
} from '@/types/ui'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Upload } from 'lucide-react'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'Document Management',
    href: '#',
  },
]

const DocumentManagementPage = () => {
  const { user } = useUserContext()

  // PRefetch users
  usePrefetchRequest({
    key: ['usersByRole'],
    url: '/api/users',
  })

  const role = user?.role

  const isRecordsLevel = role === 'records' || role === 'admin'

  const { isPending, data, isError, error } = useGetRequest({
    url: isRecordsLevel ? '/api/record/documents' : '/api/document/assignments',
    key: ['documents', role],
  })

  const columnValuesForFilter: ColumnValuesForFilterStatus[] = isRecordsLevel
    ? [
        { value: '1', label: 'Pending' },
        { value: '2', label: 'Archived' },
        { value: '3', label: 'Completed' },
        { value: '4', label: 'Delayed' },
        { value: '5', label: 'Released' },
      ]
    : [
        { value: '6', label: 'Pending' },
        { value: '7', label: 'Completed' },
        { value: '8', label: 'Delayed' },
      ]

  const searchFilterInputValues: FilterSearchInput = {
    placeholder: 'Search by tracking number',
    column: 'tracking_no',
  }

  const btnActions = () => {
    if (!isRecordsLevel) return
    return (
      <Button size="sm" asChild>
        <Link to="/records/upload-document">
          <Upload />
          Upload
        </Link>
      </Button>
    )
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        {isPending && <DataTableSkeleton columnCount={8} />}
        {isError && <p>{error?.message}</p>}
        {data && (
          <DataTable
            columns={documentColumns}
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

export default DocumentManagementPage
