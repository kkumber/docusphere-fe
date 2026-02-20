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
    <div className="space-y-6 text-sm overflow-y-auto max-h-[60vh] my-4">
      {/* Document Information */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Document Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tracking No */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Tracking No</p>
            </div>
            <p className="font-medium truncate">{document.tracking_no}</p>
          </div>

          {/* Title */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Title</p>
            </div>
            <p className="font-medium break-words">{document.title}</p>
          </div>

          {/* Category */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Category</p>
            </div>
            <p className="font-medium first-letter:uppercase break-words">
              {document.category}
            </p>
          </div>

          {/* Request Type */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Request Type</p>
            </div>
            <p className="font-medium break-words">{document.request_type}</p>
          </div>

          {/* Originating Office */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Originating Office</p>
            </div>
            <p className="font-medium break-words">
              {document.originating_office}
            </p>
          </div>

          {/* Uploaded By */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Uploaded By</p>
            </div>
            <p className="font-medium break-words">{document.uploaded_by}</p>
          </div>

          {/* Created At */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Created At</p>
            </div>
            <p className="font-medium break-words">
              {new Date(document.created_at).toLocaleString()}
            </p>
          </div>

          {/* Updated At */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">Last Updated</p>
            </div>
            <p className="font-medium break-words">
              {new Date(document.updated_at).toLocaleString()}
            </p>
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
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">Assigned By</p>
                </div>
                <p className="font-medium break-words">
                  {assignment.assigned_by}
                </p>
              </div>

              {/* Request Type */}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">Request Type</p>
                </div>
                <p className="font-medium break-words">
                  {assignment.request_type}
                </p>
              </div>

              {/* Due Date */}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">Due Date</p>
                </div>
                <p className="font-medium break-words">
                  {assignment.due_date
                    ? new Date(assignment.due_date).toLocaleDateString()
                    : 'No due date'}
                </p>
              </div>

              {/* Status */}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">Status</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {assignment.status}
                </span>
              </div>
            </div>

            {/* Instructions */}
            {assignment.instructions && (
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Instructions
                </p>
                <p className="leading-relaxed break-words">
                  {assignment.instructions}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DocumentInformation
