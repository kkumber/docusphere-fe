import type { User } from '@/types/user'
import { useEffect, useState } from 'react'

type Props = {
  pdfUrl: string
  user: User
}

export const PdfViewer = ({ pdfUrl, user }: Props) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full h-screen">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-none rounded-md"
        title="PDF Viewer"
      />

      {user && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-xl font-bold opacity-30 rotate-[-30deg] text-center select-none">
            Viewed by {user.last_name}, {user.first_name} - ({user.role})
            <br />
            {user.email}
            <br />
            {time.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}
