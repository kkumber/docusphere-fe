import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { ChartAreaInteractive } from '@/components/ui/chart-area'
import useGetRequest from '@/hooks/use-get'
import DashboardSkeleton from '@/components/dashboard-skeleton'
import { useEffect, useState } from 'react'
import type { DashboardValues, DataReseponse } from '@/types/response'

const breadcrumbList: Breadcrumbs[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
]

const DashboardPage = () => {
  const { isPending, data, isError, error } = useGetRequest<
    DataReseponse<DashboardValues>
  >({
    url: '/api/dashboard',
    key: ['dashboard'],
  })

  const [dashboardData, setDashboardData] = useState<DashboardValues>()

  useEffect(() => {
    if (data) {
      setDashboardData(data.data)
    }
  }, [data])

  return (
    <>
      <Header breadcrumbs={breadcrumbList} />
      <MainContainer>
        {isPending && <DashboardSkeleton />}
        {isError && <p>{error?.message}</p>}
        {dashboardData && (
          <>
            <div className="flex gap-6 flex-wrap justify-center items-center mb-8">
              {dashboardData.cards.map((card) => (
                <Card key={card.title} className="flex-1 min-w-40">
                  <CardHeader>
                    <CardDescription>{card.title}</CardDescription>
                    <CardContent className={`text-3xl font-bold p-0 m-0`}>
                      {card.value}
                    </CardContent>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="">
              <ChartAreaInteractive areaChart={dashboardData.area_chart} />
            </div>
          </>
        )}
      </MainContainer>
    </>
  )
}

export default DashboardPage
