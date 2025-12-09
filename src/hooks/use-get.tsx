import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

type GetRequestProps = {
  url: string
  key: unknown[]
}

const useGetRequest = ({ url, key }: GetRequestProps) => {
  const { isPending, data, isError, error } = useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const response = await api.get(url)
        return response.data
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
      }
    },
  })

  return { isPending, data, isError, error }
}

export default useGetRequest
