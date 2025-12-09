export interface Response<TData> {
    message: string
    data: TData
    error: string | null
}