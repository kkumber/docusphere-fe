import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/skeleton-table'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import { Button } from '@/components/ui/button'
import useGetRequest from '@/hooks/use-get'
import type {
  Breadcrumbs,
  ColumnValuesForFilterStatus,
  FilterSearchInput,
} from '@/types/ui'
import { Link } from '@tanstack/react-router'
import { Upload } from 'lucide-react'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'Document Management',
    href: '#',
  },
]

const DocumentManagementPage = () => {
  const { isPending, data, isError, error } = useGetRequest({
    url: '/records/document',
    key: ['documents'],
  })

  const columnValuesForFilter: ColumnValuesForFilterStatus[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'completed', label: 'Completed' },
  ]

  const searchFilterInputValues: FilterSearchInput = {
    placeholder: 'Search by tracking number',
    column: 'tracking_no',
  }

  const btnActions = () => {
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

export default DocumentManagementPage
