'use client'

import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'

export function DashboardCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Card className="shadow-sm h-full w-full overflow-auto">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-blue/10">
            <CalendarIcon className="h-5 w-5 text-primary-blue" />
          </div>

          <div className="space-y-1">
            <CardTitle>Calendar</CardTitle>
            <CardDescription className="text-sm">
              Current month overview
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  )
}
