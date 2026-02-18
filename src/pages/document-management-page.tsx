import { DataTable } from '@/components/data-table/data-table'
import { documentColumns } from '@/components/data-table/document-columns'
import { DataTableSkeleton } from '@/components/data-table/skeleton-table'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import { Button } from '@/components/ui/button'
import useGetRequest from '@/hooks/use-get'
import usePrefetchRequest from '@/hooks/use-prefetch-request'
import type { Document } from '@/types/document'
import type {
  Breadcrumbs,
  ColumnValuesForFilterStatus,
  FilterSearchInput,
} from '@/types/ui'
import { Link, useRouteContext } from '@tanstack/react-router'
import { Files, Upload } from 'lucide-react'

const breadcrumbs: Breadcrumbs[] = [
  {
    title: 'Document Management',
    href: '#',
  },
]

const DocumentManagementPage = () => {
  const { authentication } = useRouteContext({
    from: '/_authenticated/_layout/documents/document-management',
  })

  // Use directly instead of state
  const userRole = authentication.userRole()
  // Prefetch users
  usePrefetchRequest({
    key: ['usersByRole'],
    url: '/api/users/roles',
  })

  const isRecordsLevel = userRole === 'records' || userRole === 'admin'

  const { isPending, data, isError, error } = useGetRequest<{
    data: Document[]
  }>({
    url: isRecordsLevel ? '/api/record/documents' : '/api/document/assignments',
    key: ['documents', userRole],
    enabled: !!userRole,
  })

  // Map column values for filter must corresponds to the status ID in the database
  const columnValuesForFilter: ColumnValuesForFilterStatus[] = isRecordsLevel
    ? [
        { value: '1', label: 'Pending' },
        { value: '2', label: 'Archived' },
        { value: '3', label: 'Completed' },
        { value: '4', label: 'Delayed' },
        { value: '5', label: 'Released' },
        { value: '20', label: 'Draft Approved' },
        { value: '21', label: 'For Issuance' },
        { value: '22', label: 'Rejected' },
      ]
    : [
        { value: '2', label: 'Archived' },
        { value: '3', label: 'Completed Documents' },
        { value: '6', label: 'Pending' },
        { value: '12', label: 'Completed Assignments' },
        { value: '13', label: 'Delayed' },
        { value: '18', label: 'Draft' },
        { value: '19', label: 'Draft In Review' },
        { value: '20', label: 'Draft Approved' },
        { value: '21', label: 'For Issuance' },
        { value: '22', label: 'Rejected' },
      ]

  const searchFilterInputValues: FilterSearchInput = {
    placeholder: 'Search by tracking number',
    column: 'tracking_no',
  }

  const btnActions = () => {
    return (
      <Button size="sm" className="max-w-min" asChild>
        <Link to="/records/upload-document">
          <Upload />
          <span className="">Upload</span>
        </Link>
      </Button>
    )
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-blue/10 p-2">
              <Files className="h-5 w-5 text-primary-blue" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Document List
              </h2>
              <p className="text-sm text-gray-500">
                Browse, filter, and manage documents in your workflow
              </p>
            </div>
          </div>
        </div>
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
