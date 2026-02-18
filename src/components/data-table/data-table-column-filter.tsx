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

const GROUP_LABELS: Record<string, string> = {
  document: 'Document Status',
  assignment: 'Assignment Status',
  draft: 'Draft Status',
}

type RenderEntry =
  | { type: 'header'; label: string }
  | { type: 'item'; item: ColumnValuesForFilterStatus }

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

  const renderItems = columnValuesForFilter.reduce<RenderEntry[]>(
    (acc, item) => {
      if (item.group) {
        const lastHeader = [...acc].reverse().find((r) => r.type === 'header')
        const isDifferentGroup =
          !lastHeader ||
          (lastHeader.type === 'header' &&
            lastHeader.label !== GROUP_LABELS[item.group])

        if (isDifferentGroup) {
          acc.push({ type: 'header', label: GROUP_LABELS[item.group] })
        }
      }
      acc.push({ type: 'item', item })
      return acc
    },
    [],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-center items-center max-w-min"
          size="sm"
        >
          <Filter />
          Status
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 space-y-2">
        <p className="text-sm font-medium leading-none">Filter By:</p>
        <Separator className="my-2" />
        {renderItems.map((entry, index) =>
          entry.type === 'header' ? (
            <div key={`header-${index}`}>
              {index !== 0 && <Separator className="my-2" />}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-1">
                {entry.label}
              </p>
            </div>
          ) : (
            <div
              className="flex items-center space-x-2"
              key={`item-${entry.item.value}`}
            >
              <Checkbox
                checked={value.includes(String(entry.item.value))}
                onCheckedChange={() => toggle(String(entry.item.value))}
              />
              <span className="text-sm">{entry.item.label}</span>
            </div>
          ),
        )}
      </PopoverContent>
    </Popover>
  )
}
