import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import useGetRequest from '@/hooks/use-get'
import type { Response } from '@/types/response'

/* =======================
   Types
======================= */

type User = {
  id: number
  name: string
  role: string
  email: string
}

type RoutingHistory = {
  id: number
  status_id: number
  created_at: string
  from: User
  to: User
}

type Props = {
  isOpen: boolean
  onClose: () => void
  documentId: string
}

/* =======================
   Helpers
======================= */

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

const getRoleColor = (role: string) => {
  switch (role) {
    case 'RECORDS':
      return 'bg-gray-100 text-gray-700'
    case 'SDS':
      return 'bg-blue-100 text-blue-700'
    case 'CHIEF':
      return 'bg-purple-100 text-purple-700'
    case 'STAFF':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

/* =======================
   Component
======================= */

const TrackingModal = ({ isOpen, onClose, documentId }: Props) => {
  const {
    data: history,
    isPending,
    isError,
  } = useGetRequest<Response<RoutingHistory[]>>({
    key: ['document-routing-history', documentId],
    url: `/api/document/${documentId}/track`,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          flex flex-col
          w-[95vw] sm:max-w-2xl
          max-h-[90vh]
          p-0
          overflow-auto
        "
      >
        {/* ================= Header ================= */}
        <DialogHeader className="shrink-0 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Routing History
            </DialogTitle>

            <DialogDescription className="hidden">
              Routing History
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* ================= Body ================= */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full px-6 py-4">
            {isPending && (
              <p className="text-sm text-gray-500">Loading routing history…</p>
            )}

            {isError && (
              <p className="text-sm text-red-500">
                Failed to load routing history.
              </p>
            )}

            {!isPending && history?.data?.length === 0 && (
              <p className="text-sm text-gray-500">
                No routing history available.
              </p>
            )}

            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-3 top-1 bottom-0 w-px bg-gray-200" />

              {history?.data?.map((item) => (
                <div key={item.id} className="relative pl-10">
                  {/* Dot */}
                  <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-blue-500 border-4 border-white" />

                  <div className="space-y-1">
                    {/* Date / Time */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(item.created_at)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(item.created_at)}
                      </span>
                    </div>

                    {/* Action */}
                    <p className="text-sm text-gray-700">
                      Routed from{' '}
                      <span className="font-medium">{item.from.name}</span> to{' '}
                      <span className="font-medium">{item.to.name}</span>
                    </p>

                    {/* Roles */}
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded ${getRoleColor(
                          item.from.role,
                        )}`}
                      >
                        {item.from.role}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span
                        className={`px-2 py-0.5 rounded ${getRoleColor(
                          item.to.role,
                        )}`}
                      >
                        {item.to.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* ================= Footer ================= */}
        <div className="shrink-0 px-6 py-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TrackingModal
