import type { User } from '@/types/user'
import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

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
    <div className="relative w-full rounded-md overflow-hidden border bg-background">
      {/* Top utility bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          Open in new tab
        </a>
      </div>

      {/* PDF container */}
      <div className="relative w-full h-[85vh] md:h-[70vh] bg-secondary">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title="PDF Viewer"
        />

        {/* Watermark overlay */}
        {user && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-lg md:text-xl font-bold opacity-30 rotate-[-30deg] text-center select-none">
              Viewed by {user.last_name}, {user.first_name} ({user.role})
              <br />
              {user.email}
              <br />
              {time.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
