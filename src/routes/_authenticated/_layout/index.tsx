import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '@/pages/dashboard-page'

export const Route = createFileRoute('/_authenticated/_layout/')({
  component: Dashboard,
})

function Dashboard() {
  return <DashboardPage />
}
