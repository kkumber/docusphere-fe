import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

type GetRequestProps = {
  url: string
  key: unknown[]
  enabled?: boolean
}

const useGetRequest = ({ url, key, enabled }: GetRequestProps) => {
  const { isPending, data, isError, error } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get(url)
      return response.data
    },
    enabled,
  })

  return { isPending, data, isError, error }
}

export default useGetRequest
