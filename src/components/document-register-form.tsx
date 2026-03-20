import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CalendarIcon,
  FileText,
  Info,
  ClipboardList,
  Building2,
  UploadCloud,
  Eye,
  RotateCcw,
  Send,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import useUploadDocument from '@/hooks/use-upload-document'
import { formatLocalDate, validateDueDate } from '@/utils/validate-due-date'
import { Route } from '@/routes/__root'
import useUploadDraft from '@/hooks/use-upload-draft'
import { Link } from '@tanstack/react-router'
import { AssignDocModal } from '@/components/assign-doc-modal'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { getOffices } from '@/utils/deped-office'
import type { Office } from '@/utils/deped-office'
import { Checkbox } from './ui/checkbox'

export interface DocumentFormState {
  tracking_no: string
  title: string
  instructions: string
  category: string
  originating_office: string
  request_type: string
  due_date: any
  file: File | null
}

export default function DocumentRegistrationForm() {
  const mutation = useUploadDocument()
  const uploadDraft = useUploadDraft()
  const { authentication } = Route.useRouteContext()
  const isUserRecords =
    authentication.userRole() === 'records' ||
    authentication.userRole() === 'admin'

  const offices: Office[] = getOffices()
  const currentYear = new Date().getFullYear()

  const [formData, setFormData] = useState<DocumentFormState>({
    tracking_no: !isUserRecords
      ? `DRAFT-`
      : `Category, ID, S. ${currentYear} Title`,
    title: '',
    instructions: '',
    category: '',
    originating_office: '',
    request_type: '',
    due_date: null,
    file: null,
  })
  const [fileError, setFileError] = useState('')
  const [dueDateError, setDueDateError] = useState('')
  const [otherOffice, setOtherOffice] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFileError('')
    setDueDateError('')
    mutation.reset()
    uploadDraft.reset()

    const file = formData.file
    const due_date = formData.due_date
      ? formatLocalDate(formData.due_date)
      : null

    if (!file) return setFileError('Please upload a file.')

    if (due_date && !validateDueDate(due_date)) {
      return setDueDateError('Due date cannot be in the past.')
    }

    if (file) {
      if (file.type !== 'application/pdf') {
        return setFileError('Please upload a PDF file.')
      } else if (file.size > 10 * 1024 * 1024) {
        return setFileError('File size must be less than 10MB.')
      }
    }

    const payload = {
      ...formData,
      due_date: due_date,
    }

    if (!isUserRecords) {
      uploadDraft.mutate(payload)
    } else {
      mutation.mutate(payload)
    }
  }

  const handleResetForm = () => {
    setFormData({
      tracking_no: !isUserRecords
        ? `DRAFT-`
        : `Category, ID, S. ${currentYear} Title`,
      title: '',
      instructions: '',
      category: '',
      originating_office: '',
      request_type: '',
      due_date: null,
      file: null,
    })
    setFileError('')
    setDueDateError('')
    mutation.reset()
    uploadDraft.reset()
  }

  const errorResponse =
    mutation.error?.response?.data || uploadDraft.error?.response?.data

  const uploadedData = mutation.data || uploadDraft.data
  const showActions =
    (mutation.isSuccess || uploadDraft.isSuccess) && uploadedData

  return (
    <Card className="max-w-3xl mx-auto border border-muted shadow-sm">
      {/* Header */}
      <CardHeader className="border-b space-y-2 relative">
        <div className="flex flex-wrap max-md:gap-4 items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary-blue" />
              Upload Document
            </CardTitle>
            <CardDescription>
              Register and route documents for processing and tracking.
            </CardDescription>
          </div>

          {/* 🔹 ACTION ICONS WITH TOOLTIPS */}
          {showActions && (
            <TooltipProvider>
              <div className="flex items-center gap-2">
                {/* View */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="View Document"
                      asChild
                    >
                      <Link
                        to="/documents/$documentId"
                        params={{
                          documentId: uploadedData.document.id?.toString(),
                        }}
                      >
                        <Eye className="h-4 w-4 text-primary-blue" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Document</p>
                  </TooltipContent>
                </Tooltip>

                {/* Assign */}
                <Tooltip>
                  <AssignDocModal
                    documentId={uploadedData.document.id}
                    documentTitle={formData.title}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Assign Document"
                        >
                          <Send className="h-4 w-4 text-primary-blue" />
                        </Button>
                      </TooltipTrigger>
                    }
                  />
                  <TooltipContent>
                    <p>Assign to Users</p>
                  </TooltipContent>
                </Tooltip>

                {/* Reset */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleResetForm}
                      aria-label="Reset Form"
                    >
                      <RotateCcw className="h-4 w-4 text-primary-blue" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Form</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>

        {errorResponse && (
          <p className="text-sm text-destructive">{errorResponse.message}</p>
        )}
        {dueDateError && (
          <p className="text-sm text-destructive">{dueDateError}</p>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Document Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ClipboardList className="h-4 w-4 text-primary-blue" />
              Document Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="tracking_no">Tracking Number</FieldLabel>
                <Input
                  id="tracking_no"
                  placeholder={formData.tracking_no}
                  value={formData.tracking_no}
                  required
                  onChange={handleInputChange}
                  disabled={true}
                />
              </Field>

              <Field>
                <FieldLabel>
                  Due Date{' '}
                  <span className="ml-1.5 text-xs font-normal text-slate-400">
                    (optional)
                  </span>
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.due_date && 'text-muted-foreground',
                      )}
                      disabled={isUserRecords}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary-blue" />
                      {formData.due_date
                        ? formData.due_date.toDateString()
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date ?? undefined}
                      onSelect={(date) => {
                        setFormData((prev) => ({
                          ...prev,
                          due_date: date ?? null,
                        }))
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Brief document title"
                value={formData.title}
                required
                onChange={handleInputChange}
              />
            </Field>
          </section>

          {/* Section: Instructions */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Info className="h-4 w-4 text-primary-blue" />
              Additional Notes
            </div>

            <Field>
              <FieldLabel htmlFor="instructions">
                Instructions{' '}
                <span className="ml-1.5 text-xs font-normal text-slate-400">
                  (optional)
                </span>
              </FieldLabel>
              <FieldDescription>
                Provide routing notes or special handling instructions.
              </FieldDescription>
              <Textarea
                id="instructions"
                placeholder="Detailed instructions..."
                rows={3}
                value={formData.instructions}
                onChange={handleInputChange}
              />
            </Field>
          </section>

          {/* Section: Classification */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary-blue" />
              Classification & Routing
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="memorandum">Memorandum</SelectItem>
                    <SelectItem value="unnumbered_memorandum">
                      Unnumbered Memorandum
                    </SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                    <SelectItem value="endorsement">Endorsement</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Request Type</FieldLabel>
                <Select
                  required
                  value={formData.request_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      request_type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_signature">For Signature</SelectItem>
                    <SelectItem value="for_approval">For Approval</SelectItem>
                    <SelectItem value="for_acknowledgement">
                      For Acknowledgement
                    </SelectItem>
                    <SelectItem value="for_review">For Review</SelectItem>
                    <SelectItem value="for_response">For Response</SelectItem>
                    <SelectItem value="for_issuance">For Issuance</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="originating_office">
                Originating Office
              </FieldLabel>
              {!otherOffice ? (
                <Select
                  required
                  value={formData.originating_office}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      originating_office: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select originating office" />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((office) => (
                      <SelectItem key={office.name} value={office.name}>
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="originating_office"
                  placeholder="e.g. HR, Accounting, Curriculum"
                  value={formData.originating_office}
                  required
                  onChange={handleInputChange}
                />
              )}

              {/* Others office input field */}
              <div className="flex gap-2 items-center mt-2">
                <Checkbox
                  checked={otherOffice}
                  onCheckedChange={() => setOtherOffice(!otherOffice)}
                  className="w-4 h-4"
                />
                <FieldDescription>Other (please specify).</FieldDescription>
              </div>
            </Field>
          </section>

          {/* Section: File Upload */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UploadCloud className="h-4 w-4 text-primary-blue" />
              Document File
            </div>

            <Field>
              <FieldLabel htmlFor="file">Attach Document</FieldLabel>
              <FieldDescription>
                Upload the official document (PDF only, max 10MB).
              </FieldDescription>

              {fileError && (
                <p className="text-sm text-destructive">{fileError}</p>
              )}

              <Input
                id="file"
                type="file"
                accept=".pdf"
                required
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    file: e.target.files ? e.target.files[0] : null,
                  }))
                }
              />
            </Field>
          </section>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending || uploadDraft.isPending}
          >
            {mutation.isPending || uploadDraft.isPending
              ? 'Uploading...'
              : 'Upload Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
