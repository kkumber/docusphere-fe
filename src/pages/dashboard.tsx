import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

const breadcrumbList: Breadcrumbs[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
]

const SampleCards = [
  {
    title: 'Card 1',
    data: 21,
    color: 'text-black',
  },
  {
    title: 'Card 2',
    data: 28,
    color: 'text-yellow-500',
  },
  {
    title: 'Card 3',
    data: 40,
    color: 'text-green-500',
  },
  {
    title: 'Card 4',
    data: 500,
    color: 'text-red-500',
  },
]

const DashboardPage = () => {
  return (
    <>
      <Header breadcrumbs={breadcrumbList} />

      <MainContainer>
        <div className="flex gap-6 flex-wrap justify-center items-center">
          {SampleCards.map((card) => (
            <Card key={card.title} className="flex-1 min-w-40">
              <CardHeader>
                <CardDescription>{card.title}</CardDescription>
                <CardContent
                  className={`text-3xl font-bold ${card.color} p-0 m-0`}
                >
                  {card.data}
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </div>
      </MainContainer>
    </>
  )
}

export default DashboardPage
