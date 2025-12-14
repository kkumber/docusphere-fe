import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { AxiosError } from 'axios'

type PostRequestProps = {
  url: string
  requestData: unknown
}

const usePostRequest = ({ url, requestData }: PostRequestProps) => {
  const mutation = useMutation<AxiosError>({
    mutationFn: async () => {
      const { data } = await api.post(url, requestData)
      return data.data
    },
  })
}

export default usePostRequest
