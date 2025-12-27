import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type Update = {
  date: string
  time: string
  status: string
  title: string
  description: string
  userInitials: string
  userName: string
}

// Example usage with sample data
const sampleUpdates: Update[] = [
  {
    date: 'November 9, 2024',
    time: '2:45 PM',
    status: 'completed',
    title: 'Document approved by Board of Directors',
    description:
      'Final approval received. Document is now ready for implementation.',
    userInitials: 'JD',
    userName: 'John Dela Cruz',
  },
  {
    date: 'November 8, 2024',
    time: '10:30 AM',
    status: 'reviewed',
    title: 'Document reviewed and forwarded to Board',
    description:
      'Comprehensive review completed. All financial projections verified and recommendations added.',
    userInitials: 'MS',
    userName: 'Maria Santos',
  },
  {
    date: 'November 7, 2024',
    time: '4:15 PM',
    status: 'in progress',
    title: 'Document sent for departmental review',
    description:
      'Circulated to all department heads for input and recommendations.',
    userInitials: 'AR',
    userName: 'Ana Reyes',
  },
  {
    date: 'November 6, 2024',
    time: '9:00 AM',
    status: 'completed',
    title: 'Supporting documents attached',
    description:
      'Added financial statements, revenue projections, and expense breakdown documents.',
    userInitials: 'AR',
    userName: 'Ana Reyes',
  },
]

type Props = {
  isOpen?: boolean
  onClose?: () => void
  updates?: Update[]
}

const TrackingModal = ({
  isOpen = true,
  onClose = () => {},
  updates = [],
}: Props) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'reviewed':
        return 'bg-blue-100 text-blue-700'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getIconColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'reviewed':
        return 'bg-green-500'
      case 'in progress':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Document Update Log
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-gray-200" />

            {/* Updates */}
            <div className="space-y-6">
              {updates.map((update, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white ${getIconColor(
                      update.status,
                    )}`}
                  />

                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {update.date}
                        </span>
                        <span className="text-xs text-gray-500">
                          {update.time}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium w-fit ${getStatusColor(
                          update.status,
                        )}`}
                      >
                        {update.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-semibold text-gray-900">
                      {update.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-600">
                      {update.description}
                    </p>

                    {/* User */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        {update.userInitials}
                      </div>
                      <span className="text-xs text-gray-600">
                        {update.userName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Export Log
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TrackingModal
