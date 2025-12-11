import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../ui/separator'
import { Circle } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { ColumnValuesForFilterStatus } from '@/types/ui'

interface StatusFilterProps<TData> {
  table: Table<TData>
  columnValuesForFilter: ColumnValuesForFilterStatus[]
}

export function TableColumnFilter<TData>({
  table,
  columnValuesForFilter,
}: StatusFilterProps<TData>) {
  const column = table.getColumn('status')
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
          className="w-40 justify-start border-2 border-dashed"
        >
          <Circle />
          Status
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40 space-y-2">
        Filter By:
        <Separator className="my-2" />
        {columnValuesForFilter.map((item, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <Checkbox
              checked={value.includes(item.value)}
              onCheckedChange={() => toggle(item.value)}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
