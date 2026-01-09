import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { ReusableAlertDialog } from '@/components/reusable-alert-dialog'
import DocumentInformation from '@/components/document-information'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface DocumentDetailsProps {
  title: string
  isPending: boolean
  documentDetails: any
  error: string
  pdfUrl?: string
}

const DocumentDetails = ({
  title,
  isPending,
  documentDetails,
  error,
}: DocumentDetailsProps) => {
  const [tabValue, setTabValue] = useState('information')

  return (
    <ReusableAlertDialog
      triggerButton={
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Info className="w-4 h-4" /> More Details
        </Button>
      }
      title={title}
      description="View all details, history, and attachments for this document."
      additionalContent={
        <div className=" w-full max-w-lg">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList className="inline-flex mb-2">
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

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
              <div className="text-sm text-muted-foreground">
                Attachments will be displayed here.
              </div>
            </TabsContent>

            {/* LOGS TAB */}
            <TabsContent value="logs">
              <div className="text-sm text-muted-foreground">
                Logs will be displayed here.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      }
    />
  )
}

export default DocumentDetails
