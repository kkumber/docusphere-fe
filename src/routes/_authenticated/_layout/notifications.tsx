import NotificationPage from '@/pages/notification-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/notifications')({
  component: NotificationRoute,
})

function NotificationRoute() {
  return <NotificationPage />
}
