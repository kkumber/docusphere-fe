import { useState, useMemo } from 'react'
import { Bell, Check, Trash2, Mail, MailOpen } from 'lucide-react'
import useGetRequest from '@/hooks/use-get'
import type { Response } from '@/types/response'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'

type NotificationPayload = {
  request_type: string
  assigned_by: number
  instructions: string | null
}

type Notification = {
  id: number
  user_id: number
  document_id: number | null
  subject: string
  data: NotificationPayload
  is_read: boolean
  created_at: string
  updated_at: string
}

const NotificationPage = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const queryClient = useQueryClient()

  const {
    data: response,
    isPending,
    isError,
  } = useGetRequest<Response<Notification[]>>({
    url: '/api/notifications',
    key: ['notifications'],
  })

  const notifications = response?.data ?? []

  const markNotification = useMutation({
    mutationFn: ({ ids, markAs }: { ids: number[]; markAs: string }) => {
      return api.post(`/api/notifications/${markAs}`, { notifications: ids })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['sidebarNotifications'] })
    },
  })

  const filteredNotifications = useMemo(() => {
    return filter === 'unread'
      ? notifications.filter((n) => !n.is_read)
      : notifications
  }, [notifications, filter])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length
  }, [notifications])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id))
    }
  }

  const markAsRead = (ids: number[]) => {
    markNotification.mutate({
      ids,
      markAs: 'read',
    })
    setSelectedIds([])
  }

  const markAsUnread = (ids: number[]) => {
    markNotification.mutate({
      ids,
      markAs: 'unread',
    })
    setSelectedIds([])
  }

  return (
    <>
      <Header breadcrumbs={[{ title: 'Notifications', href: '#' }]} />
      <MainContainer>
        <div className="w-full h-full flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === filteredNotifications.length &&
                  filteredNotifications.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />

              <button
                onClick={() => markAsRead(selectedIds)}
                disabled={selectedIds.length === 0}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                title="Mark as read"
              >
                <MailOpen className="w-4 h-4 text-gray-700" />
              </button>

              <button
                onClick={() => markAsUnread(selectedIds)}
                disabled={selectedIds.length === 0}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                title="Mark as unread"
              >
                <Mail className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setFilter('all')}
                className={`font-medium ${
                  filter === 'all'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`font-medium ${
                  filter === 'unread'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
          </div>

          {/* Inbox Container */}
          <div className="flex-1 divide-y rounded-lg border bg-white">
            {isPending ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Bell className="w-14 h-14 mb-4 animate-pulse" />
                <p className="text-sm">Loading notifications…</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-400">
                <Bell className="w-14 h-14 mb-4" />
                <p className="text-sm">Failed to load notifications</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Bell className="w-14 h-14 mb-4" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group flex gap-3 px-3 py-4 transition ${
                      !notification.is_read
                        ? 'bg-blue-50/50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => toggleSelect(notification.id)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600"
                    />

                    {!notification.is_read && (
                      <div className="mt-2 w-2 h-2 rounded-full bg-blue-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <h3
                          className={`text-sm truncate ${
                            !notification.is_read
                              ? 'font-semibold text-gray-900'
                              : 'font-medium text-gray-800'
                          }`}
                        >
                          {notification.subject}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(notification.created_at) ?? 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {notification.data && (
                          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            {notification.data.request_type ?? 'N/A'}
                          </span>
                        )}
                        {notification.document_id && (
                          <span className="text-xs text-gray-500">
                            Doc #{notification.document_id ?? 'N/A'}
                          </span>
                        )}
                      </div>

                      {notification.data && notification.data.instructions && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {notification.data.instructions}
                        </p>
                      )}

                      {/* Row actions */}
                      <div className="flex gap-4 mt-2 opacity-0 group-hover:opacity-100 transition">
                        {!notification.is_read ? (
                          <button
                            onClick={() => markAsRead([notification.id])}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Read
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread([notification.id])}
                            className="text-xs text-gray-600 hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            Unread
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* End of notifications footer */}
                <div className="flex items-center justify-center py-6 text-xs text-gray-400 bg-gray-50">
                  <div className="flex-1 border-t mx-6" />
                  <span className="px-2">End of notifications</span>
                  <div className="flex-1 border-t mx-6" />
                </div>
              </>
            )}
          </div>
        </div>
      </MainContainer>
    </>
  )
}

export default NotificationPage
