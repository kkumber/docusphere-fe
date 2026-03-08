import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import { Card, CardContent } from '@/components/ui/card'
import { ChartAreaInteractive } from '@/components/ui/chart-area'
import useGetRequest from '@/hooks/use-get'
import DashboardSkeleton from '@/components/dashboard-skeleton'
import { useEffect, useState } from 'react'
import type { DashboardValues, DataResponse } from '@/types/response'
import { AlertCircle, BarChart3, Activity, Info } from 'lucide-react'
import { DashboardCalendar } from '@/components/dashboard-calendar'

const breadcrumbList: Breadcrumbs[] = [{ title: 'Dashboard', href: '/' }]

const DashboardPage = () => {
  const { isPending, data, isError, error } = useGetRequest<
    DataResponse<DashboardValues>
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

        {dashboardData && (
          <div className="space-y-12">
            {/* WELCOME BANNER */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-blue via-primary-blue/95 to-primary-blue/90 px-8 py-8 shadow-md">
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2.5">
                  <Activity className="h-6 w-6 text-white" />
                  <h1 className="text-2xl font-bold text-white">
                    Dashboard Overview
                  </h1>
                </div>
                <p className="max-w-2xl text-sm text-white/90">
                  Monitor your system activity and track record progress in
                  real-time
                </p>
              </div>
            </div>

            {/* SUMMARY METRICS */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardData.cards.map((card, index) => (
                  <Card
                    key={card.title}
                    className="group relative overflow-hidden border-l-4 border-l-primary-blue bg-white p-0 shadow-sm transition-all duration-200 hover:shadow-lg"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                            {card.title}
                          </p>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-blue/10 text-primary-blue transition-transform duration-200 group-hover:scale-110">
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-3xl font-bold tracking-tight text-gray-900">
                            {card.value}
                          </p>
                          <p className="text-xs text-gray-500">Current total</p>
                        </div>
                      </div>
                    </CardContent>
                    {/* Subtle gradient accent */}
                    <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary-blue/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Card>
                ))}
              </div>
            </section>

            {/* ACTIVITY & TRENDS */}
            <section className="space-y-6">
              {/* Chart and Calendar Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ChartAreaInteractive areaChart={dashboardData.area_chart} />
                </div>
                <div className="lg:col-span-1">
                  <DashboardCalendar />
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
              <p className="text-center text-xs text-gray-600">
                Data updates automatically as records are processed • Last
                updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </MainContainer>
    </>
  )
}

export default DashboardPage
