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

interface StatusFilterProps<TData> {
  table: Table<TData>
}
export function TableColumnFilter<TData>({ table }: StatusFilterProps<TData>) {
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
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={value.includes('1')}
            onCheckedChange={() => toggle('1')}
          />
          <span>Active</span>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={value.includes('0')}
            onCheckedChange={() => toggle('0')}
          />
          <span>Inactive</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
