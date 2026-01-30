import { Input } from '@/components/ui/input'
import { TableColumnFilter } from './data-table-column-filter'
import { DataTableViewOptions } from './data-table-column-toggle'
import type { Table } from '@tanstack/react-table'
import type { ColumnValuesForFilterStatus, FilterSearchInput } from '@/types/ui'

interface Props<TData> {
  table: Table<TData>
  searchFilterInput: FilterSearchInput
  columnValuesForFilter: ColumnValuesForFilterStatus[]
  btnActions?: React.ReactNode
}
export default function ActionBars<TData>({
  table,
  searchFilterInput,
  columnValuesForFilter,
  btnActions,
}: Props<TData>) {
  return (
    <div className="w-full flex flex-col gap-4 mb-4">
      {/* MOBILE VERSION */}
      <div className="md:hidden space-x-4 space-y-6 w-full">
        {/* Search */}
        <div className="flex items-center justify-between w-full">
          <Input
            placeholder={searchFilterInput.placeholder}
            value={
              (table
                .getColumn(searchFilterInput.column)
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(e) =>
              table
                .getColumn(searchFilterInput.column)
                ?.setFilterValue(e.target.value)
            }
            className=""
          />
        </div>
        {/* Actions Dropdown */}
        <div className="flex flex-wrap gap-2">
          <TableColumnFilter
            table={table}
            columnValuesForFilter={columnValuesForFilter}
          />
          <DataTableViewOptions table={table} />
          {/* Additional button actions (optional) */}
          {btnActions}
        </div>
      </div>

      {/* DESKTOP VERSION */}
      <div className="hidden md:flex gap-4 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Input
              placeholder={searchFilterInput.placeholder}
              value={
                (table
                  .getColumn(searchFilterInput.column)
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(e) =>
                table
                  .getColumn(searchFilterInput.column)
                  ?.setFilterValue(e.target.value)
              }
              className="min-w-80"
            />
            <TableColumnFilter
              table={table}
              columnValuesForFilter={columnValuesForFilter}
            />
          </div>

          <div className="flex items-center gap-4">
            <DataTableViewOptions table={table} />
            {btnActions}
          </div>
        </div>
      </div>
    </div>
  )
}
