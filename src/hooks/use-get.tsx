import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

type GetRequestProps<TData> = {
  url: string
  key: unknown[]
  enabled?: boolean
}

const useGetRequest = <TData,>({
  url,
  key,
  enabled,
}: GetRequestProps<TData>) => {
  const { isPending, data, isError, error } = useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get<TData>(url)
      return response.data
    },
    enabled,
  })

  return { isPending, data, isError, error }
}

export default useGetRequest
