export interface Response<TData> {
    message: string
    data: TData
    error: string | null
}

export interface ApiError {
  message: string
  errors: {
    [key: string]: string[]
  }
}