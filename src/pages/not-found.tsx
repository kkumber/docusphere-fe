import { Link } from '@tanstack/react-router'
import { FileX2, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-primary-blue" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          {/* Icon block */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-primary-blue/5" />
              <div className="absolute inset-4 rounded-full bg-primary-blue/8" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-blue/10">
                <FileX2
                  className="h-11 w-11 text-primary-blue"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Error code + heading */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-blue">
              Error 404
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Page not found
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Please
            check the URL or navigate back to a safe place.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary-blue/40" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="sm"
              className="w-full sm:w-auto bg-primary-blue hover:bg-primary-blue/90 text-white gap-2 px-6"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto border-gray-200 text-gray-600 hover:border-primary-blue hover:text-primary-blue gap-2 px-6"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-5 border-t border-gray-100">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Docusphere DTS
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage
