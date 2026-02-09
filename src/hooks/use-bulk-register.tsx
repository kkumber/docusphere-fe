import type { CSVUser } from '@/components/bulk-register-form'
import api from '@/lib/api'
import type { ApiError, Response } from '@/types/response'
import type { User } from '@/types/user'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

interface BulkUsers {
  users: CSVUser[]
}

const useBulkRegister = () => {
  const mutation = useMutation<
    Response<User[]>,
    AxiosError<ApiError>,
    BulkUsers
  >({
    mutationFn: async (users) => {
      const { data } = await api.post('/api/users/bulk-register', users)
      return data.data
    },
    onSuccess: () => {
      toast.success('Users registered successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('User registration failed: ' + error.message)
      }
    },
  })

  return mutation
}

export default useBulkRegister
