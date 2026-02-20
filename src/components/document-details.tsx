import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Info, MessageSquare } from 'lucide-react'
import { ReusableAlertDialog } from '@/components/reusable-alert-dialog'
import DocumentInformation from '@/components/document-information'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import useGetRequest from '@/hooks/use-get'
import { getRouteApi } from '@tanstack/react-router'
import type { Response } from '@/types/response'
import type { User } from '@/types/user'

interface DocumentDetailsProps {
  title: string
  isPending: boolean
  documentDetails: any
  error: string
  pdfUrl?: string
}

interface AttachmentResponse {
  id: number
  file_name?: string
  url: string
  created_at: string
  user: User
  remarks: string
}

interface LogResponse {
  id: number
  action: string
  performed_by: User & { role?: string }
  created_at: string
  remarks?: string
}

const route = getRouteApi('/_authenticated/_layout/documents/$documentId')

const DocumentDetails = ({
  title,
  isPending,
  documentDetails,
  error,
}: DocumentDetailsProps) => {
  const { documentId } = route.useParams()
  const [tabValue, setTabValue] = useState('information')

  const { data: attachmentsResp } = useGetRequest<
    Response<AttachmentResponse[]>
  >({
    url: `/api/document/${documentId}/attachments`,
    key: ['documentAttachments', documentId.toString()],
  })

  const attachments = attachmentsResp?.data ?? []

  const { data: logsResp } = useGetRequest<Response<LogResponse[]>>({
    url: `/api/document/${documentId}/actions`,
    key: ['documentLogs', documentId.toString()],
  })

  const logs = logsResp?.data ?? []

  return (
    <ReusableAlertDialog
      triggerButton={
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          More Details
        </Button>
      }
      title={title}
      description="View all details, history, and attachments for this document."
      additionalContent={
        <div className="w-full max-w-lg">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <div className="mb-2 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
            </div>

            {/* INFORMATION TAB */}
            <TabsContent value="information">
              <DocumentInformation
                isPending={isPending}
                documentDetails={documentDetails}
                error={error}
              />
            </TabsContent>

            {/* ATTACHMENTS TAB */}
            <TabsContent value="attachments">
              <div className="my-4 space-y-3">
                {attachments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No attachments available.
                  </p>
                )}

                {attachments.map((attachment, index) => {
                  const uploader = `${attachment!.user!.first_name} ${attachment!.user!.last_name}`
                  const uploadedAt = new Date(
                    attachment.created_at,
                  ).toLocaleString()

                  return (
                    <div
                      key={attachment.id}
                      className="space-y-2 rounded-lg border bg-card px-3 py-3"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.file_name ??
                              `Attachment No.${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded by {uploader} • {uploadedAt}
                          </p>
                        </div>

                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </a>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            {/* LOGS TAB */}
            <TabsContent value="logs">
              <div className="my-4">
                {logs.length === 0 && (
                  <div className="flex items-center justify-center rounded-lg border border-dashed py-8">
                    <p className="text-sm text-muted-foreground">
                      No activity logs recorded.
                    </p>
                  </div>
                )}

                {logs.length > 0 && (
                  <div className="relative space-y-3 pl-6">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

                    {logs.map((log) => {
                      const user = log.performed_by
                      const date = new Date(log.created_at)
                      const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                      const formattedTime = date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })

                      const initials =
                        `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()

                      return (
                        <div key={log.id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-6 top-3 flex h-4 w-4 items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background ring-4 ring-background" />
                          </div>

                          {/* Card */}
                          <div className="rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                            {/* Top: action + date */}
                            <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary truncate">
                                {log.action}
                              </p>
                              <div className="shrink-0 text-right">
                                <p className="text-xs font-medium text-muted-foreground">
                                  {formattedDate}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formattedTime}
                                </p>
                              </div>
                            </div>

                            {/* Body: avatar + name + org info */}
                            <div className="flex items-center gap-3 px-3 py-4 min-w-0">
                              {/* Avatar */}
                              <div className="shrink-0 size-8 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xs font-bold text-muted-foreground">
                                  {initials}
                                </span>
                              </div>

                              {/* Name + org info */}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold leading-tight truncate">
                                  {user.first_name} {user.last_name}
                                </p>

                                {/* Org info  */}
                                <div className="flex items-center gap-1 mt-0.5 min-w-0 overflow-x-auto scrollbar-none">
                                  {user.office && (
                                    <>
                                      <span className="text-xs text-muted-foreground ">
                                        {user.office}{' '}
                                        {user.department
                                          ? `• ${user.department}`
                                          : ''}{' '}
                                        • {user.designation}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Remarks */}
                            {log.remarks && (
                              <div className="mx-3 mb-3 mt-4 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 px-3 py-2.5">
                                <MessageSquare className="shrink-0 size-3.5 mt-0.5 text-amber-500" />
                                <div className="min-w-0">
                                  <p className="text-xs text-amber-900 dark:text-amber-200 break-words leading-relaxed">
                                    {log.remarks}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      }
    />
  )
}

export default DocumentDetails
