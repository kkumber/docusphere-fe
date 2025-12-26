import { createFileRoute } from '@tanstack/react-router'
import TrackingModal from '@/components/tracking-modal'

export const Route = createFileRoute(
  '/_authenticated/_layout/documents/tracking',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <TrackingModal />
}
