export interface Response<TData> {
    message: string
    data: TData
    error: string | null
}

export interface ApiError {
  message: string
  errors?: {
    [key: string]: string[]
  }
}

export interface SuccessResponse<TData> {
  message: string
  data: TData
  error: null
}

interface DashboardCardsData {
  title: string
  value: number
}

interface AreaChartDateValue {
  date: string
  count: number
}

export interface DashboardAreaChartData {
  title: string
  description: string
  label: string
  value: AreaChartDateValue[]
}

export interface DashboardValues {
  cards: DashboardCardsData[]
  area_chart: DashboardAreaChartData
}

export interface DataResponse<TData> {
  data: TData
}