import {
  FileText,
  Tag,
  Building2,
  Calendar,
  Clock,
  User,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react'

interface DocumentInformationProps {
  isPending: boolean
  documentDetails: any
  error: string | undefined
}

const DocumentInformation = ({
  isPending,
  documentDetails,
  error,
}: DocumentInformationProps) => {
  if (isPending) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading document details…
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        {error}
      </div>
    )
  }

  if (!documentDetails) return null

  const { document, assignment } = documentDetails

  return (
    <div className="space-y-6 text-sm overflow-y-auto max-h-[60vh]">
      {/* Document Information */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Document Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tracking No */}
          <div className="flex items-start gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Tracking No</p>
              </div>
              <p className="font-medium">{document.tracking_no}</p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-start gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Category</p>
              </div>
              <p className="font-medium first-letter:uppercase">
                {document.category}
              </p>
            </div>
          </div>

          {/* Originating Office */}
          <div className="flex items-start gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Originating Office</p>
              </div>
              <p className="font-medium">{document.originating_office}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-start gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Created At</p>
              </div>
              <p className="font-medium">
                {new Date(document.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Updated At */}
          <div className="flex items-start gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">Last Updated</p>
              </div>
              <p className="font-medium">
                {new Date(document.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Information */}
      {assignment && (
        <>
          <div className="border-t" />

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Assignment Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Assigned By */}
              <div className="flex items-start gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Assigned By</p>
                  </div>
                  <p className="font-medium">{assignment.assigned_by}</p>
                </div>
              </div>

              {/* Request Type */}
              <div className="flex items-start gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Request Type</p>
                  </div>
                  <p className="font-medium">{assignment.request_type}</p>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-start gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Due Date</p>
                  </div>
                  <p className="font-medium">
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleDateString()
                      : 'No due date'}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Status</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {assignment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {assignment.instructions && (
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Instructions
                </p>
                <p className="leading-relaxed">{assignment.instructions}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DocumentInformation
