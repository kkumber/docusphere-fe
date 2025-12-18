import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

const DashboardSkeleton = () => {
  const skeletonCards = Array.from({ length: 4 }, (_, i) => i)

  return (
    <>
      {/* Top Cards */}
      <div className="flex gap-6 flex-wrap justify-center items-center mb-8">
        {skeletonCards.map((i) => (
          <Card key={i} className="flex-1 min-w-40">
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
              <CardContent className="p-0 m-0">
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <div className="">
        <Skeleton className="w-full h-80 rounded-md" />
      </div>
    </>
  )
}

export default DashboardSkeleton
