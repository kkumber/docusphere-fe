import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'

import { DataTablePagination } from './data-table-pagination'

import type { ColumnValuesForFilterStatus, FilterSearchInput } from '@/types/ui'

import ActionBars from './action-bars'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnValuesForFilter: ColumnValuesForFilterStatus[]
  searchFilterInput: FilterSearchInput
  btnActions?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnValuesForFilter,
  searchFilterInput,
  btnActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]) // state for sorting function columns
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // state for filters or search function on the table
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // state for visibility of columns

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const rows = table.getRowModel().rows || []

  return (
    <div>
      <ActionBars
        table={table}
        searchFilterInput={searchFilterInput}
        columnValuesForFilter={columnValuesForFilter}
        btnActions={btnActions}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-md border mt-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
