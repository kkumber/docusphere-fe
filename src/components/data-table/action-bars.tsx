import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { ListFilter, Settings } from 'lucide-react'
import { SlidersHorizontal, Columns, MoreVertical } from 'lucide-react'
import { TableColumnFilter } from './data-table-column-filter'
import { DataTableViewOptions } from './data-table-column-toggle'
import type { Table } from '@tanstack/react-table'
import type { ColumnValuesForFilterStatus, FilterSearchInput } from '@/types/ui'
import { Button } from '../ui/button'

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
      <div className="flex md:hidden flex-col gap-4 w-full">
        {/* Search left, actions dropdown right */}
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
            className="max-w-sm min-w-60"
          />

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full p-0 m-0">
                <MoreVertical className="" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-56 p-2 space-y-2">
              {/* FILTERS SUBMENU */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm">
                  <ListFilter className="h-4 w-4" /> Filters
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent className="space-y-3 p-2 min-w-48">
                  {/* Status Filter */}
                  <div className="flex items-center gap-2 text-sm">
                    <SlidersHorizontal className="h-4 w-4" /> Status Filter
                  </div>
                  <div className="pl-6">
                    <TableColumnFilter
                      table={table}
                      columnValuesForFilter={columnValuesForFilter}
                    />
                  </div>

                  {/* Column Visibility */}
                  <div className="flex items-center gap-2 text-sm pt-3 border-t">
                    <Columns className="h-4 w-4" /> Columns
                  </div>
                  <div className="pl-6">
                    <DataTableViewOptions table={table} />
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* ACTIONS SUBMENU */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" /> Actions
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent className="space-y-3 p-2 min-w-48">
                  {btnActions}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
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
              className="max-w-sm min-w-60"
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
