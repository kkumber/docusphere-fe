import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../ui/separator'
import type { Table } from '@tanstack/react-table'
import type { ColumnValuesForFilterStatus } from '@/types/ui'
import { Filter } from 'lucide-react'

interface StatusFilterProps<TData> {
  table: Table<TData>
  columnValuesForFilter: ColumnValuesForFilterStatus[]
}

export function TableColumnFilter<TData>({
  table,
  columnValuesForFilter,
}: StatusFilterProps<TData>) {
  const column = table.getColumn('status')
    ? table.getColumn('status')
    : table.getColumn('status_id')
  const value = (column?.getFilterValue() as string[]) ?? []

  const toggle = (item: string) => {
    if (value.includes(item)) {
      column?.setFilterValue(value.filter((v) => v !== item))
    } else {
      column?.setFilterValue([...value, item])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="flex justify-center items-center border-2 border-dashed"
          size="sm"
        >
          <Filter />
          Status
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40 space-y-2">
        <p className="text-sm font-medium leading-none">Filter By:</p>
        <Separator className="my-2" />
        {columnValuesForFilter.map((item, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <Checkbox
              checked={value.includes(String(item.value))}
              onCheckedChange={() => toggle(String(item.value))}
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
