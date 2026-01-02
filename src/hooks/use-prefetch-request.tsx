import api from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type Props = {
  key: string[]
  url: string
}

const usePrefetchRequest = ({ key, url }: Props) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: async () => {
        const { data } = await api.get(url)
        return data.data
      },
      staleTime: 1000 * 60 * 5,
    })
  }, [queryClient, key, url])
}

export default usePrefetchRequest
